using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CDM.Portal.PortalAppWeb.Models;
using CDM.Portal.PortalAppWeb.Models.CustomEntities;

namespace CDM.Portal.PortalAppWeb.Models
{
    public class DAL
    {
        CDMEntities Context = new CDMEntities();

        public IQueryable<Source> GetSources()
        {
            return Context.Sources;
        }

        public IQueryable<SourceType> GetSourceTypes()
        {
            return Context.SourceTypes;
        }

        public int SaveChanges()
        {
            return Context.SaveChanges();
        }

        public GAUser AddGAUser(GAUser user)
        {
            return Context.GAUsers.Add(user);
        }
        public IQueryable<GAUser> GetGAUsers()
        {
            return Context.GAUsers;
        }

        internal SourceType GetSourceTypeById(int id)
        {
            return this.Context.SourceTypes.FirstOrDefault(t => t.Id == id);
        }

        internal bool UpsertSource(ItemDataSources unSource)
        {
            try
            {
                int aux = Convert.ToInt32(unSource.id);
                var encontro = Context.Sources.Where(item => item.Id == aux);
                Source auxSource = new Source();
                
                if (encontro.Count() > 0)
                {
                    auxSource = encontro.FirstOrDefault();
                }
                else
                {
                    auxSource.Id = (Context.Sources.Count() > 0) ? Context.Sources.Max(i => i.Id) + 1 : 1;
                }

                auxSource.Name = unSource.Name;
                auxSource.Address = unSource.Adress;
                auxSource.Type = Convert.ToInt32(unSource.Type);
                auxSource.User = unSource.user;
                auxSource.Password = unSource.password;
                auxSource.Schedule = unSource.ScheduleCant;
                auxSource.LastUpdated = DateTime.Now;
                auxSource.Description = unSource.Description;
                auxSource.Enable = unSource.enable == "on";
                if (encontro.Count() == 0)
                {
                    Context.Sources.Add(auxSource);
                }
                Context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Could not upsert data source", ex);
            }
        }

        internal bool DeleteSource(int IdSource)
        {
            try
            {
                Source elSource = this.Context.Sources.Where(item => item.Id == IdSource).FirstOrDefault();
                Context.Sources.Remove(elSource);
                Context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Could not delete data source", ex);
            }
        }

        internal string GetScheduleCant(string scheduler)
        {
            return scheduler;
        }

        internal string GetScheduleUnit(string scheduler)
        {
            return scheduler;
        }

        internal List<ItemDataSources> FilterTypes(List<ItemDataSources> listResult, string types)
        {
            List<ItemDataSources> result = new List<ItemDataSources>();
            string[] splitTypes = types.Split(',');
            foreach (var item in splitTypes)
            {
                List<ItemDataSources> PartialList = listResult.Where(i => i.Type == item).ToList();
                foreach (var unDS in PartialList)
                {
                    result.Add(unDS);
                }
            }
            return result;
        }

        internal Dictionary<string, int> GetCantForFilter(List<ItemDataSources> listDataSources)
        {
            Dictionary<string, int> result = new Dictionary<string, int>();
            var types = this.GetSourceTypes();
            foreach (var item in types)
            {
                int cant = listDataSources.Where(i => i.Type == item.Id.ToString()).Count();
                result.Add(item.Id.ToString(), cant);
            }
            return result;
        }
    }
}