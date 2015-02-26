using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace CDM.Portal.PortalAppWeb.Controllers
{
    //[SharePointContextFilter]
    public class BaseController : Controller
    {
        const string Key_Session_Last_PartView = "Last_PartView";
        const string PartView_Default = "SearchPage";

        protected override void OnAuthentication(System.Web.Mvc.Filters.AuthenticationContext filterContext)
        {
            base.OnAuthentication(filterContext);

            // TODO: Move this to an AuthenticationHelper instead of viewbag
            ViewBag.Username = HttpContext.User.Identity.IsAuthenticated ? HttpContext.User.Identity.Name : "Anonymous";
        }

        public string LastPartView
        {
            get
            {
                if (Session[Key_Session_Last_PartView] == null)
                {
                    Session[Key_Session_Last_PartView] = PartView_Default;
                }
                return Session[Key_Session_Last_PartView].ToString();
            }
            set
            {
                Session.Timeout = 10000;
                Session[Key_Session_Last_PartView] = value;
            }
        }

        public ActionResult GetLastPartView() {
            return Json(LastPartView,JsonRequestBehavior.AllowGet);
        }

        public ActionResult SetLastPartView(string NamePartView) {
            LastPartView = NamePartView;
            return Json(true, JsonRequestBehavior.AllowGet);
        }

    }
}
