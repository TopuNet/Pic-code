using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace Pic_code_NET.Pic_code
{
    /// <summary>
    /// 验证验证码
    /// </summary>
    public class Pic_code_valid : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

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
            if (HttpContext.Current.Session["pic_code_validcode"] == null)
            {
                context.Response.Write("{\"error\":\"ERROR\"}");
                context.Response.End();
            }
            else
            {
                int session = 0;
                try
                {
                    session = Convert.ToInt32(HttpContext.Current.Session["pic_code_validcode"]);
                }
                catch
                {
                    session = 0;
                }
                if (session - valid_range <= dix_long && dix_long <= session + valid_range)
                {
                    context.Response.Write("{\"error\":\"SUCCESS\"}");
                    context.Response.End();
                }
                else
                {
                    context.Response.Write("{\"error\":\"ERROR\"}");
                    context.Response.End();
                }
            }
            #endregion
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}