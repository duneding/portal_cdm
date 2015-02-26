using CDM.Portal.PortalAppWeb.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CDM.Portal.PortalAppWeb.Controllers
{
    public class BicoeController : Controller
    {
        // GET: Citropedia
    //        [URLContextFilterAttribute]
        public ActionResult Index()
        {
            ViewBag.Scope = "bicoe";
            return View();
            //return Redirect("http://office2013.citrite.net/sites/bicoe");
            
        }
    }
}