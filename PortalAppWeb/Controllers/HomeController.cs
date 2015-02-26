using CDM.Portal.PortalAppWeb.Filters;
using CDM.Portal.PortalAppWeb.Models.CustomEntities;
using CDM.Portal.PortalAppWeb.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CDM.Portal.PortalAppWeb.Controllers
{
    [URLContextFilterAttribute]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            //User spUser = null;            
            //var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

            //using (var clientContext = spContext.CreateUserClientContextForSPHost())
            //{
            //    if (clientContext != null)
            //    {
            //        spUser = clientContext.Web.CurrentUser;

            //        clientContext.Load(spUser, user => user.Title);

            //        clientContext.ExecuteQuery();

            //        ViewBag.UserName = spUser.Title;
            //    }
            //}
                        
            ViewBag.Scope = "portal";
            ViewBag.GAId = GetUserGAId(ViewBag.Username);

            return View();
        }

        private String GetUserGAId(String username)
        {
            string gaId = "";
            DAL model = new DAL();
            var users = model.GetGAUsers();

            var user = users.SingleOrDefault(u => u.Username.ToLower() == username);

            if (user != null)
                gaId = user.GAId;
            else
            {
                gaId = Guid.NewGuid().ToString();
                GAUser newUser = new GAUser();
                newUser.Username = username.ToLower();
                newUser.GAId = gaId;
                model.AddGAUser(newUser);
                model.SaveChanges();
            }

            return gaId;
        }
       
    }
}
