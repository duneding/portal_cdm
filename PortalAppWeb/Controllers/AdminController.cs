using CDM.Portal.PortalAppWeb.Models;
using CDM.Portal.PortalAppWeb.Models.CustomEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CDM.Portal.PortalAppWeb.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        int pageSize = 10;

        DAL Model = new DAL();
        
        public ActionResult Get_DataSources(string Name, int? Type)
        {
            int filtroType = -1;
            if (Type != null)
            {
                filtroType = Convert.ToInt32(Type);
            }
            var listaResult = Model.GetSources().ToList().Where(unDs =>
                (unDs.Name.ToLower().Contains(Name.ToLower()) || Name.Equals(string.Empty)) &&
                (unDs.Type == filtroType || Type == null)).Select(unDataSource => new object[] {
                        unDataSource.Id,
                        new object[] {
                            unDataSource.Id,
                            unDataSource.Name,
                            unDataSource.Address,
                            (this.Model.GetSourceTypeById(unDataSource.Type) != null) ? this.Model.GetSourceTypeById(unDataSource.Type).Name : "",
                            unDataSource.Type,
                            unDataSource.Schedule
                        }
            });

            return Json(listaResult, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Reload(string filter, int page, string types)
        {
            var listDataSources = this.Model.GetSources().ToList();
            List<ItemDataSources> listResult = listDataSources.Where(DS =>
                DS.Name.ToLower().Contains(filter.ToLower())
            ).Select(item => new ItemDataSources
            {
                id = item.Id.ToString(),
                Adress = item.Address,
                Description = item.Description,
                Name = item.Name,
                ScheduleCant = this.Model.GetScheduleCant(item.Schedule),
                Type = item.Type.ToString()
            }).ToList();

            if (types != "")
            {
                listResult = this.Model.FilterTypes(listResult, types);
            }



            Dictionary<string, int> CastCantTypes = new Dictionary<string, int>();

            CastCantTypes = this.Model.GetCantForFilter(listResult);

            listResult = listResult.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            int TotalResult = listResult.Count();

            int CantPagInt = TotalResult / pageSize;
            decimal cantPageDec = (Convert.ToDecimal(TotalResult) / pageSize);
            CantPagInt = (CantPagInt < cantPageDec) ? (CantPagInt + 1) : CantPagInt;

            return Json(new { Items = listResult, TotalResult = TotalResult, CantPages = CantPagInt, page = page, CantTypes = CastCantTypes.ToList() });
        }

        public ActionResult Search_DataSources(string textfilter)
        {
            var listaResult = Model.GetSources().ToList().Select(item => new ItemDataSources
            {
                Adress = item.Address,
                Description = item.Description,
                Name = item.Name,
                ScheduleCant = item.Schedule,
                Type = (this.Model.GetSourceTypeById(item.Type) != null) ? this.Model.GetSourceTypeById(item.Type).Name : ""
            });
            return Json(listaResult);
        }

        public ActionResult GetTypes()
        {
            var listResult = this.Model.GetSourceTypes().ToList().Select(unType => new TypeFiltersSearch { Value = unType.Id.ToString(), Text = unType.Name });

            return Json(listResult, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AM_DataSources(ItemDataSources unDataSource, string UnidadSquedule)
        {
            //unDataSource.Schedule = unDataSource.Schedule + UnidadSquedule;
            bool rta = this.Model.UpsertSource(unDataSource);
            return Json(rta);
        }

        public ActionResult DeleteDataSource(int IdDataSource)
        {
            bool rta = this.Model.DeleteSource(IdDataSource);
            return Json(rta, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Save(ItemDataSources DS)
        {
            bool rta = this.Model.UpsertSource(DS);
            return Json(rta);
        }

        public ActionResult GetDataSource(string idDataSource)
        {
            var unDS = this.Model.GetSources().ToList().Find(DS => DS.Id == Convert.ToInt32(idDataSource));
            ItemDataSources result = new ItemDataSources
            {
                id = unDS.Id.ToString(),
                Name = unDS.Name,
                Adress = unDS.Address,
                Description = unDS.Description,
                ScheduleCant = this.Model.GetScheduleCant(unDS.Schedule),
                Type = unDS.Type.ToString(),
                user = unDS.User,
                password = unDS.Password
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}