using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace WebApplication1
{
    /// <summary>
    /// Login 的摘要说明
    /// </summary>
    public class Login : IHttpHandler, IReadOnlySessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            int dix_long = Convert.ToInt32(context.Request.Form["dix_long"].ToString().Trim());
            int valid_range = Convert.ToInt32(context.Request.Form["valid_range"].ToString().Trim());

            int session=Convert.ToInt32(HttpContext.Current.Session["pic_code_validcode"]);

            if (session - valid_range <= dix_long && dix_long <= session + valid_range)
            {
                context.Response.Write("{\"error\":\"SUCCESS\"}");
            }
            else
            {
                context.Response.Write("{\"error\":\"ERROR\"}");
            }

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