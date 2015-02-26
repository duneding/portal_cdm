using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CDM.Portal.PortalAppWeb.Controllers
{
    public class CitropediaController : Controller
    {
        // GET: Citropedia
        public ActionResult Index()
        {
            ViewBag.Scope = "citropedia";
            return View();
        }
    }
}