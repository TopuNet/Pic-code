using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Design;
using System.IO;
using System.Web.SessionState;

namespace Pic_code_final.Pic_code
{
    /// <summary>
    /// Pic_code 的摘要说明
    /// </summary>
    public class Pic_code : IHttpHandler, IReadOnlySessionState
    {
        public static string temppath = "/UploadFile/temp/";//临时文件夹路径
        public static string captchapath = "/Pic_code/images/";//验证码底图库文件夹路径
        public static int i = 20;//水印图距离边缘的距离
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            #region ==检查临时文件夹是否存在==
            DirectoryInfo di = new DirectoryInfo(context.Server.MapPath(temppath));
            if (!di.Exists)
                di.Create();
            #endregion

            #region ==检查验证码底图库是否存在==
            DirectoryInfo di1 = new DirectoryInfo(context.Server.MapPath(captchapath));
            if (!di1.Exists)
            {
                context.Response.Write("{\"error\":\"ERROR\",\"msg\":\"验证码底图库不存在\"}");
                context.Response.End();
            }
            #endregion

            Random r = new Random();
            //随机一张底图
            string FromFilePath = context.Server.MapPath(captchapath + r.Next(1, 8).ToString() + ".jpg");
            //小图保存路径
            string saveFilePath = temppath + DateTime.Now.ToString("yyyyMMdd") + r.Next(1000, 5555).ToString() + ".jpg";
            //带水印的原图保存路径
            string saveFilePath2 = temppath + DateTime.Now.ToString("yyyyMMdd") + r.Next(5555, 9999).ToString() + ".jpg";

            string retmsg = Make_Pic_code(FromFilePath, saveFilePath, saveFilePath2);
            context.Response.Write(retmsg);
            context.Response.End();
        }

        /// <summary>
        /// 制作图片验证码
        /// </summary>
        /// <param name="FromFilePath">底图路径(Server.MapPath())</param>
        /// <param name="saveFilePath1">小图保存路径</param>
        /// <param name="saveFilePath2">带水印的原图保存路径</param>
        /// <returns></returns>
        public string Make_Pic_code(string FromFilePath, string saveFilePath1, string saveFilePath2)
        {
            #region ==验证底图和水印图是否存在==
            if (!File.Exists(FromFilePath))
            {
                return "{\"error\":\"ERROR\",\"msg\":\"底图不存在\"}";
            }

            string waterFilePath = HttpContext.Current.Server.MapPath(captchapath + "water.png");
            if (!File.Exists(waterFilePath))
            {
                return "{\"error\":\"ERROR\",\"msg\":\"水印图不存在\"}";
            }
            #endregion

            #region ==计算水印位置的坐标==
            System.Drawing.Image FromImage = System.Drawing.Image.FromFile(FromFilePath);//底图
            System.Drawing.Image waterImage = System.Drawing.Image.FromFile(waterFilePath);//水印图

            int width = waterImage.Width;//水印图片的宽
            int height = waterImage.Height;//水印图片的高
            int max_width = FromImage.Width - width - i;//水印左上角的横坐标范围
            int max_height = FromImage.Height - height - i;//水印左上角的纵坐标范围

            if (max_width <= 0 || max_height <= 0)
                return "{\"error\":\"ERROR\",\"msg\":\"水印图比底图大\"}";

            Random r1 = new Random();
            Random r2 = new Random();
            int x = Convert.ToInt32(r1.Next(i, max_width).ToString());//水印左上角的横坐标
            int y = Convert.ToInt32(r2.Next(i, max_height).ToString());//水印左上角的纵坐标
            #endregion
           
            #region ==截取原图中一部分存为文件==
            //载入底图   
            Image fromImage = Image.FromFile(FromFilePath);
            //创建新图位图   
            Bitmap bitmap = new Bitmap(width, height);
            //创建作图区域   
            Graphics graphic = Graphics.FromImage(bitmap);
            //截取原图相应区域写入作图区   
            graphic.DrawImage(fromImage, 0, 0, new Rectangle(x, y, width, height), GraphicsUnit.Pixel);
            //从作图区生成新图   
            Image saveImage = Image.FromHbitmap(bitmap.GetHbitmap());
            //保存图象   
            saveImage.Save(HttpContext.Current.Server.MapPath(saveFilePath1), ImageFormat.Jpeg);
            //释放资源   
            saveImage.Dispose();
            bitmap.Dispose();
            graphic.Dispose();
            #endregion

            #region ==将处理过的底图存为文件==
            Graphics graphics = Graphics.FromImage(FromImage);
            graphics.DrawImage(waterImage, new Rectangle(x, y, width, height), 0, 0, width, height, GraphicsUnit.Pixel);
            graphics.Dispose();
            MemoryStream stream = new MemoryStream();
            FromImage.Save(stream, ImageFormat.Jpeg);
            FromImage.Dispose();
            System.Drawing.Image imageWithWater = System.Drawing.Image.FromStream(stream);
            imageWithWater.Save(HttpContext.Current.Server.MapPath(saveFilePath2), ImageFormat.Jpeg);
            imageWithWater.Dispose();
            #endregion

            #region ==将横坐标存为Session==
            HttpContext.Current.Session["pic_code_validcode"] = HttpContext.Current.Server.UrlEncode(x.ToString());
            #endregion

            return "{\"error\":\"SUCCESS\",\"Y\":\"" + y + "\",\"img1\":\"" + saveFilePath1 + "\",\"img2\":\"" + saveFilePath2 + "\"}";

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