<%@ WebHandler Language="C#" Class="Pic_code_valid" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using LitJson;
using System.Net;
using System.IO;
using System.Text;

public class Pic_code_valid : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {

        context.Response.ContentType = "text/plain";

        string secret_filePath = context.Server.MapPath("/Pic_code/secret.txt");

        // 默认验证登录的接口，***不要改***，dev时，从js传过来
        string handlerUrl_default = "http://www.abc.com/Handler/abc.ashx";
        string handlerType_default = "Members";
        string handlerAct_default = "Select";

        //以下四行允许跨域，跨域时允许携带请求凭证
        //Access-Control-Allow-Origin：允许来源，根据实际情况修改，必须为请求的地址，不能为*
        //context.Response.AddHeader("Access-Control-Allow-Origin", "http://192.168.1.92:82");
        //context.Response.AddHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
        //context.Response.AddHeader("Access-Control-Allow-Headers", "x-requested-with,content-type");
        //context.Response.AddHeader("Access-Control-Allow-Credentials", "true");

        #region ==接收表单==
        int dix_long = 0;//Pic_code横坐标
        try
        {
            dix_long = Convert.ToInt32(context.Request.Form["dix_long"].ToString().Trim());
        }
        catch
        {
            dix_long = 0;
        }
        int valid_range = 0;//Pic_code容错率
        try
        {
            valid_range = Convert.ToInt32((context.Request.Form["valid_range"].ToString().Trim()));
        }
        catch
        {
            valid_range = 0;
        }
        #endregion

        #region ==验证Pic_code==
        if (context.Session["pic_code_validcode"] == null)
        {
            context.Response.Write("{\"error\":\"ERROR\"}");
            context.Response.End();
        }
        else
        {
            #region ==记录验证次数，第三次不管对错都清空session==
            try
            {
                context.Session["pic_code_validcode_count"] = Convert.ToInt16(context.Session["pic_code_validcode_count"]) + 1;
                if (Convert.ToInt16(context.Session["pic_code_validcode_count"]) >= 3)
                    context.Session["pic_code_validcode"] = null;
            }
            catch
            {
                context.Session["pic_code_validcode_count"] = 1;
            }
            #endregion

            int session = Convert.ToInt16(context.Session["pic_code_validcode"]);
            if (session - valid_range <= dix_long && dix_long <= session + valid_range)
            {
                #region ==获得表单参数==
                System.Collections.Specialized.NameValueCollection collection = context.Request.Form;
                string handlerUrl = ConvertString(collection["handlerUrl"], handlerUrl_default);
                string handlerType = ConvertString(context.Request.Form["handlerType"], handlerType_default);
                string handlerAct = ConvertString(context.Request.Form["handlerAct"], handlerAct_default);
                #endregion

                #region ==如不需要进行接口请求，则直接返回SUCCESS==
                if (handlerUrl == "no")
                {
                    context.Response.Write("{\"error\":\"SUCCESS\"}");
                    context.Response.End();
                }
                #endregion

                #region ==发起接口请求==
                int len = collection.Count;

                JsonData json = new JsonData();
                JsonData value = new JsonData();
                string para = "";

                value = new JsonData();
                List<string> ParameterList = new List<string>();
                foreach (String key in collection.AllKeys)
                {
                    switch (key.ToLower())
                    {
                        case "handlerurl":
                        case "handlertype":
                        case "handleract":
                        case "dix_long":
                        case "valid_range":
                            break;
                        default:
                            value[key] = ConvertString(collection[key]);
                            ParameterList.Add(string.Format(
                                "{0}={1}",
                                key,
                                value[key]
                            ));
                            break;
                    }
                }
                json["params"] = value;
                ParameterList.Sort();

                value = new JsonData();
                value["source"] = "default";
                string non_str = "",
                    stamp = "";
                sign_topu.Sign.signature_secret_path = secret_filePath;
                value["signature"] = sign_topu.Sign.BuildSigned(ref non_str, ref stamp, ParameterList, 1);
                value["non_str"] = non_str;
                value["stamp"] = stamp;
                json["sign_valid"] = value;
                para = "{\"validate_k\":\"1\",";
                para += "\"params\":[{\"type\":\"" + handlerType + "\",\"act\":\"" + handlerAct + "\",\"para\":" + JsonMapper.ToJson(json) + "}]}";
                LitJson.JsonData jd = new JsonData();
                try
                {
                    string result = getXMLHTTP(handlerUrl, "POST", para);
                    jd = LitJson.JsonMapper.ToObject(result);
                    try
                    {
                        context.Response.Write(LitJson.JsonMapper.ToJson(jd["result"][0]));
                    }
                    catch
                    {
                        context.Response.Write("{\"error\":\"APIERROR\",\"error_msg\":\"" + LitJson.JsonMapper.ToJson(result) + "\"}");
                    }
                }
                catch
                {
                    context.Response.Write("{\"error\":\"APIERROR\",\"error_msg\":\"服务器未知错误\"}");
                }
                context.Response.End();
                #endregion
            }
            else
            {
                context.Response.Write("{\"error\":\"ERROR\"}");
                context.Response.End();
            }
        }
        #endregion
    }

    #region == 转换变量为String ==
    /// <summary>
    /// 转换变量为String
    /// </summary>
    /// <param name="str">object</param>
    /// 
    private static string ConvertString(object str)
    {
        return ConvertString(str, "");
    }
    /// <summary>
    /// 转换变量为String
    /// </summary>
    /// <param name="str">object</param>
    /// <param name="i">catch返值</param>
    private static string ConvertString(object str, string s)
    {
        try
        {
            return str.ToString();
        }
        catch
        {
            return s;
        }
    }
    #endregion

    #region ==服务器端request请求==
    /// <summary>
    /// 服务器端request请求
    /// </summary>
    /// <param name="url">服务器端请求页面地址。http全路径，可以带地址栏参数</param>
    /// <param name="method">请求方法，GET/POST</param>
    /// <param name="Para">post参数，一个字符串</param>
    private static string getXMLHTTP(string url, string method, string Para)
    {
        string responseFromServer;
        if (Para == "")
        {
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = method;
            WebResponse rep = req.GetResponse();
            Stream webstream = rep.GetResponseStream();
            StreamReader sr = new StreamReader(webstream);
            responseFromServer = sr.ReadToEnd();
        }
        else
        {
            // Create a request using a URL that can receive a post. 
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            // Set the Method property of the request to POST.
            request.Method = method;
            // Create POST data and convert it to a byte array.
            string postData = Para;
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            // Set the ContentType property of the WebRequest.
            request.ContentType = "application/x-www-form-urlencoded";
            // Set the ContentLength property of the WebRequest.
            request.ContentLength = byteArray.Length;
            // Get the request stream.
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.
            dataStream.Close();
            // Get the response.
            WebResponse response = request.GetResponse();
            // Display the status.
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.
            dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.
            responseFromServer = reader.ReadToEnd();
            // Display the content.
            // Clean up the streams.
            reader.Close();
            dataStream.Close();
            response.Close();
        }

        return responseFromServer;
    }
    #endregion

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}