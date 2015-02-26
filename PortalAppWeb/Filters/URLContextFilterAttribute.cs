using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CDM.Portal.PortalAppWeb.Filters
{
    public class URLContextFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {

            var httpContext = new HttpContextWrapper(HttpContext.Current);
            RouteData urlRouteData = RouteTable.Routes.GetRouteData(httpContext);
            var url = context.HttpContext.Request.Url.OriginalString;

            string Url = this.URLget(context);
            
            /*-------------------------------Fin de armado de url----------------------*/
           
                Url = this.URLget(context);
                /*Guardo en la session la url de donde se hizo la peticion para pizar el viewbag en el logIn*/
                context.HttpContext.Session.Contents["URL_Anterior"] = Url;
                RouteValueDictionary redirectTargetDictionary = new RouteValueDictionary();
                redirectTargetDictionary.Add("action", "LogOn");
                redirectTargetDictionary.Add("controller", "LogIn");
               // context.Result = new RedirectToRouteResult(redirectTargetDictionary);

            

            base.OnActionExecuting(context);
        }

        private string URLget(ActionExecutingContext context)
        {

            /*Recupero los parametros de la url desde donde se hizo la peticion*/
            RouteValueDictionary tRVD = new RouteValueDictionary(context.RouteData.Values);
            /*recupero el controller y el action de la peticion anterior*/
            object controller;
            context.RouteData.Values.TryGetValue("controller", out controller);
            object action;
            context.RouteData.Values.TryGetValue("action", out action);

            string hash = (context.RouteData.Values["hash"] ?? "").ToString();
            /*armo el inicio de la url de la peticion anterior "/controller/action */
            string Url = "/" + controller.ToString() + "/" + action.ToString();
            /*armo la lista de parametros de la peticion*/
            foreach (string key in HttpContext.Current.Request.QueryString)
            {
                if (Url.Contains("?"))
                {
                    Url += "&";
                }
                else
                {
                    Url += "?";
                }

                Url += key + "=" + HttpContext.Current.Request.QueryString[key].ToString();
            }
            return Url;
        }
    }
}