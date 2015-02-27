using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using CDM.ElasticSearch;
using Newtonsoft.Json.Linq;
using CDM.Portal.PortalAppWeb.Models.CustomEntities;
using CDM.Portal.PortalAppWeb.Helpers;
using System.Configuration;

namespace CDM.Portal.PortalAppWeb.Controllers
{

    //TODO: Make sure this works with BaseController (it throws a sharepoint error: Please try again by launching the app installed on your site.
    public class SearchController : BaseController
    {

        string KeyConfig_PageSize = "SearchPageSize";
        const string KeyConfig_LongDescriptionPortal = "LongDescriptionPortal";

        Engine engine;
        bool mockSearchResults = false;
        int PageSize = 10;
        int LongDescription = 100;        

        public SearchController()
        {
            string uri = WebConfigurationManager.AppSettings["ElasticSearchUri"];
            int port = Convert.ToInt32(WebConfigurationManager.AppSettings["ElasticSearchUriPort"]);
            engine = new Engine(uri, port);

            int pageSize;
            if (int.TryParse(WebConfigurationManager.AppSettings["SearchPageSize"], out pageSize))
                engine.PageSize = pageSize;

            bool.TryParse(WebConfigurationManager.AppSettings["MockSearchResults"], out mockSearchResults);
        }

        public ActionResult Search(
            string searchTerms
            ,int PageNumber
            ,string sortBy
            ,string Types 
            ,string scope
            ,bool Aggregate
            ,string docTypes
            ,string fIdx
            ,string fTyp
            ,string fDocTyp
            ,bool bookmarksMode = false
            )
        {
            var user = ViewBag.Username as String;
            //var user = HttpContext.User.Identity.IsAuthenticated ? HttpContext.User.Identity.Name : "Anonymous";

            PageSize = Convert.ToInt32(ConfigurationManager.AppSettings[KeyConfig_PageSize]);
            LongDescription = Convert.ToInt32(ConfigurationManager.AppSettings[KeyConfig_LongDescriptionPortal]);

            // Trim search terms
            searchTerms = searchTerms.Trim();

            var criteria = new SearchCriteria();

            // Comma separated filters
            List<string> CategorysCriteria = new List<string>();
            if (Types != null && Types != "")
            {
                string[] _types = Types.Split(',');
                CategorysCriteria = _types.ToList();
            }
            if (fTyp != "")
            {
                string[] _fTyp = fTyp.Split(',');
                CategorysCriteria.AddRange(_fTyp.ToList());
                CategorysCriteria = CategorysCriteria.Distinct().ToList();
            }
            criteria.Types = CategorysCriteria;
            List<string> DocTypesCriteria = new List<string>();
            if (docTypes != null && docTypes != "")
            {
                string[] _docTypes = docTypes.Split(',');
                DocTypesCriteria = _docTypes.ToList();
            }
            if (fDocTyp != "")
            {
                string[] _fDocTyp = fDocTyp.Split(',');
                DocTypesCriteria.AddRange(_fDocTyp.ToList());
                DocTypesCriteria = DocTypesCriteria.Distinct().ToList();
            }
            criteria.ResourceTypes = DocTypesCriteria;

            criteria.PageSize = this.PageSize;
            criteria.PageNumber = (PageNumber - 1);
            criteria.Aggregate = Aggregate;

            // Index Scope
            if ((!String.IsNullOrEmpty(scope)) && (scope.ToLower() != "portal"))
            {
                criteria.Indexes = new List<string> { scope };
            }

            //Bookmarks Mode
            if (bookmarksMode)
               criteria.BookmarksUser = user.ToLower();                
                            

            var esResult = engine.Search(searchTerms, criteria);


            // HACK: Results mocks
#region Harcod
            if (PageNumber == 1 && mockSearchResults)
            {
                if (searchTerms.ToLower() == "customer")
                {
                    MockResult(criteria.Types, esResult.Results,
                        type: "terms",
                        url: "http://sharepoint.citrite.net/sites/it/ea/DMO/Citropedia/Lists/BI%20Term/DispForm.aspx?ID=2758",
                        name: "Customer",
                        description: "Customers are companies that have placed a purchase order for Citrix products and services.",
                        owner: "Carey Saunders"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "reports",
                        url: "http://ftlqtableau/views/Customer360/Main",
                        name: "Customer360 - Main",
                        description: "Main",
                        owner: "t_kathryne"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "reports",
                        url: "http://ftlpssrslb/Reports/Pages/Report.aspx?ItemPath=/CMD/AccountPenetrationReport",
                        name: "AccountPenetrationReport",
                        description: "This is a prototype to illustrate the value of Customer Master Data (CMD) to an executive level audience. It provides insight on the Top N Customers with the greatest opportunity for penetration by Product Group/Product Line and Country",
                        owner: "Citrix Operations (COPS) – Carey Saunders/Kathy Guzman"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "reports",
                        url: "http://ftlqtableau/views/AccountPenetrationV5/Customer360DB",
                        name: "Account Penetration V5 - Customer 360 DB",
                        description: "Customer 360 DB",
                        owner: "bipninderm"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "reports",
                        url: "http://ftlqtableau/views/ODS-EMEATopIssues/CustomerSat",
                        name: "ODS-EMEA Top Issues - Customer Sat",
                        description: "Customer Sat",
                        owner: "thomashul"
                    );
                }

                if (searchTerms.ToLower() == "marketing")
                {
                    MockResult(criteria.Types, esResult.Results,
                        type: "terms",
                        url: "http://sharepoint.citrite.net/sites/it/ea/DMO/Citropedia/Lists/Business%20Terms/DispForm.aspx?ID=128",
                        name: "ROI by Key Play",
                        description: "​Value of Product Pipeline opportunities resulting from each Key Play / Program $ spend on each Key Play",
                        owner: "Chirag Patel"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "reports",
                        url: "http://ftlqtableau/views/MarketingEffectiveness/MarketoGoogleAnalyticsSampleMashup",
                        name: "Marketing Effectiveness - Marketo Google Analytics Sample Mashup",
                        description: "Marketing Effectiveness Demo CDM - Marketo Google Analytics Mashup",
                        owner: "t_rafaelp"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "reports",
                        url: "http://ftlqtableau/views/MarketingEffectiveness/PathPerMarketoID",
                        name: "Marketing Effectiveness - Path Per Marketo ID",
                        description: "Path per Marketo ID",
                        owner: "t_rafaelp"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "terms",
                        url: "http://sharepoint.citrite.net/sites/it/ea/DMO/Citropedia/Lists/BI%20Term/DispForm.aspx?ID=2851",
                        name: "Field Marketing (Sales Role)",
                        description: "Field Marketing support to sales / service organization",
                        owner: "Heather McArdle"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "terms",
                        url: "http://sharepoint.citrite.net/sites/it/ea/DMO/Citropedia/Lists/BI%20Term/DispForm.aspx?ID=2895",
                        name: "Marketing Pipeline Contribution",
                        description: "Value of Product Pipeline opportunities resulting from demand marketing programs",
                        owner: "Sylvia Gudat"
                    );

                    MockResult(criteria.Types, esResult.Results,
                        type: "terms",
                        url: "http://sharepoint.citrite.net/sites/it/ea/DMO/Citropedia/Lists/Business%20Terms/DispForm.aspx?ID=130",
                        name: "Marketing Pipeline Contribution",
                        description: "​Value of Product Pipeline opportunities resulting from demand marketing programs",
                        owner: "Chirag Patel"
                    );
                }
            }
#endregion Harcod
            object items;
            if (sortBy == "type")
            {
                string groupingKey = "_type";

                // Group results by key
                items = from i in esResult.Results
                        group i by i[groupingKey] into g
                        select new TypeSearchResult
                        {
                            Type = g.Key.ToString(),
                            Items = g.Select(r => CreateItemSearchResult(r, user)).ToList()
                        };
            }
            else
            {
                items = esResult.Results.Select(i => CreateItemSearchResult(i, user)).ToList();
            }
            
            Dictionary<string, int> CastCantTypes = new Dictionary<string, int>();
            Dictionary<string, int> CastCantDocsTypes = new Dictionary<string, int>();
            var AlsoSeachedResult = engine.GetRecentSearches(searchTerms,new List<string>()).Results.Select(r => CreateItemsAlsoSearched(r)).ToList();
            var SimilarSeachedResult = engine.GetSimilarSearches(searchTerms,criteria).Results.Select(r => CreateItemsAlsoSearched(r)).ToList();

            #region Filtros

            Dictionary<string, string> filtrosAll = GetFilters();            
            Dictionary<string, string> filtrosDocTypeAll = GetFiltersDocType();
            
            List<TypeFiltersSearch> filtersResult = filtrosAll.Select(unF => new TypeFiltersSearch { Text = unF.Value, Value = unF.Key }).ToList();
            List<TypeFiltersSearch> filtersResultDocTypes = filtrosDocTypeAll.Select(unF => new TypeFiltersSearch { Text = unF.Value, Value = unF.Key }).ToList();
            
            List<string> filtrosAplicados = new List<string>();
            if (Types != null && Types != "")
            {
                filtrosAplicados = Types.Split(',').ToList();

            }
            if (docTypes != null && docTypes != "") {
                filtrosAplicados.AddRange(docTypes.Split(',').ToList());
            }
            List<TypeActives> TypesActive = new List<TypeActives>();
            foreach (var unFiltro in filtrosAplicados)
            {
                TypeFiltersSearch unType = filtersResult.Find(i => i.Value == unFiltro);
                if (unType != null)
                {
                    TypesActive.Add(new TypeActives { Value = unFiltro, Active = true });
                }
                else {
                    TypeFiltersSearch unDocType = filtersResultDocTypes.Find(i => i.Value == unFiltro);
                    if (unDocType != null)
                    {
                        TypesActive.Add(new TypeActives { Value = unFiltro, Active = true });
                    }
                }
            }
            
            #endregion


            if (Aggregate)
            {
                criteria.PageNumber = 0;
                criteria.PageSize = 0;

                // Index Scope
                if ((!String.IsNullOrEmpty(scope)) && (scope.ToLower() != "portal"))
                {
                    criteria.Indexes = new List<string> { scope };
                }
                //criteria.Types = new List<string>();
                //var esResultCount = engine.Search(searchTerms, criteria);
                CastCantTypes = esResult.Categories;
                CastCantDocsTypes = esResult.SubCategories;
                filtersResult = GetListComplete(filtersResult, CastCantTypes);
                filtersResultDocTypes = GetListComplete(filtersResultDocTypes, CastCantDocsTypes);
            }

            //switch (filAgg)
            //{
            //    case "DT":
            //        criteria.Aggregate = true;
            //        var newResult = engine.Search(searchTerms, criteria);
            //        CastCantTypes = newResult.Categories;
            //        filtersResult = GetListComplete(filtersResult, CastCantTypes);
            //        break;
            //    case "T":
            //        criteria.Aggregate = true;
            //        var newResult1 = engine.Search(searchTerms, criteria);
            //        CastCantDocsTypes = newResult1.SubCategories;
            //        filtersResultDocTypes = GetListComplete(filtersResultDocTypes, CastCantDocsTypes);
            //        break;
            //}

            
            int Position = (esResult.PageSize * (PageNumber - 1)) + 1;

            var countItems = ((List<ItemSearchResult>)items).Count();

            return Json(new
            {
                Filters = filtersResult,
                FiltersDocType = filtersResultDocTypes,
                TypesActive = TypesActive,
                PageNumber,
                sortBy,
                searchTerms,
                esResult.PageSize,
                esResult.TotalPages,
                esResult.TotalResults,
                fromPage = Position,
                toPage = (Position + countItems - 1),
                Items = items,
                AlsoSearched = AlsoSeachedResult,
                SimilarsSeareched = SimilarSeachedResult
                //,filAgg = filAgg
            });
        }

        

        int mockCount = 0;
        private void MockResult(List<string> filterTypes, List<JToken> results, string type, string url, string name, string description, string owner)
        {
            if (results.Count > mockCount && (filterTypes.Count == 0 || filterTypes.Contains(type)))
            {
                var index = mockCount;
                results[index].WriteValue("_source/_search/name", name);
                results[index].WriteValue("_source/_search/description", description);
                results[index].WriteValue("_source/_search/owner", owner);
                results[index].WriteValue("_source/_url", url);
                results[index].WriteValue("_type", type);
                mockCount++;
            }
        }

        private ItemSearchResult CreateItemSearchResult(JToken r, String user)
        {
            return new ItemSearchResult()
            {
                Name = r.ReadAsString("_source/_search/name"),
                NameHighlight = ProcessHighlight(r, "highlight/_search.name", "_source/_search/name"),
                Description = r.ReadAsString("_source/_search/description"),
                DescriptionHighlight = ProcessHighlight(r, "highlight/_search.description", "_source/_search/description", true),
                Owner = r.ReadAsString("_source/_search/owner"),
                Url = r.ReadAsString("_source/_url"),

                // HACK: Rename index type
                Type = this.GetDescriptionTypeByKey(r.ReadAsString("_type") == "reports" ? "Reports/Dashboards" : r.ReadAsString("_type")),

                //Values ES
                Index = r.ReadAsString("_index"),
                TypeEs = r.ReadAsString("_type"),
                Id = r.ReadAsString("_id"),                
                DocType = this.GetDescriptionDocTypeByKey(r.ReadAsString("_source/_search/resource")),
                Enable = ContainsBookmark(user, r)
            };
        }

        private bool ContainsBookmark(String user, JToken r)
        {
            var bookmarks = r.ReadAsStringArray("_source/_bookmarks");
            if (bookmarks != null)
                return bookmarks.Contains(user.ToLower());
            else
                return false;
        }

        private string GetDescriptionTypeByKey(string key)
        {
            var list = this.GetFilters();
            if (list.ContainsKey(key))
            {
                return list[key].ToString();
            }
            return key;
        }


        private string GetDescriptionDocTypeByKey(string key)
        {
            var list = this.GetFiltersDocType();
            if (key == null) return "";
            if (list.ContainsKey(key))
            {
                return list[key].ToString();
            }
            return key;
        }

        private string ProcessHighlight(JToken token, string highlightPath, string regularPath, bool cutLength = false)
        {
            var highlightedResults = token.ReadAsStringArray(highlightPath);

            // Process highlighted result
            if (highlightedResults != null && highlightedResults.Length > 0)
                return highlightedResults[0];//.Replace("[", "").Replace("]", "").Replace('"', ' ');

            // Return non-highlighted result
            var nonHighlighted = token.ReadAsString(regularPath);
            if (cutLength && !string.IsNullOrEmpty(nonHighlighted) && nonHighlighted.Length > LongDescription)
                nonHighlighted = nonHighlighted.Substring(0, LongDescription);
            return nonHighlighted;
        }

        private static ItemsAlsoSearched CreateItemsAlsoSearched(JToken r)
        {
            return new ItemsAlsoSearched()
            {
                term = r.ReadAsString("_source/term"),
                last = r.ReadAsString("_source/last"),
                no_results = r.ReadAsString("_source/no_results"),
                no_searches = r.ReadAsString("_source/no_searches")
            };
        }

        //public ActionResult GetFilters(string scope) {
        //    Dictionary<string, string> dicResult = CustomCast.ConfigSectionToDictionary("FiltersSettings/" + scope);
        //    List<TypeFiltersSearch> result = dicResult.Select(i => new TypeFiltersSearch { Text = i.Value, Value = i.Key }).ToList();
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}

        public Dictionary<string, string> GetFilters()
        {
            try
            {
                return CustomCast.ConfigSectionToDictionary("FiltersSettings/Type");
            }
            catch (Exception)
            {
                throw new Exception("En el web.config falta la section 'FiltersSettings/Type'");
            }
        }

        private Dictionary<string, string> GetFiltersDocType()
        {
            try
            {
                return CustomCast.ConfigSectionToDictionary("FiltersSettings/DocType");
            }
            catch (Exception)
            {
                throw new Exception("En el web.config falta la section 'FiltersSettings/DocType'");
            }

        }

        private List<TypeFiltersSearch> GetListComplete(List<TypeFiltersSearch> filtersResult, Dictionary<string, int> CastCantTypes)
        {
            List<TypeFiltersSearch> auxTypes = new List<TypeFiltersSearch>();
            foreach (var unTypeFilter in filtersResult)
            {
                var value = GetSortedValue(unTypeFilter.Value);

                if (CastCantTypes.ContainsKey(value))
                {
                    auxTypes.Add(new TypeFiltersSearch { Text = unTypeFilter.Text, Value = unTypeFilter.Value, Cant = CastCantTypes[value] });
                }
                else
                {
                    auxTypes.Add(new TypeFiltersSearch { Text = unTypeFilter.Text, Value = unTypeFilter.Value, Cant = 0 });
                }
            }
            foreach (var unCantType in CastCantTypes)
            {
                if (filtersResult.Where(item => GetSortedValue(item.Value) == unCantType.Key).Count() == 0)
                {
                    auxTypes.Add(new TypeFiltersSearch { Text = unCantType.Key.ToString(), Value = unCantType.Key.ToString(), Cant = unCantType.Value });
                }
            }
            return GetSortedFilters(auxTypes);
        }

        private String GetSortedValue(String value)
        {
            return (value.Contains('|') ?
                            value.Substring(2) :
                            value);
        }

        private List<TypeFiltersSearch> GetSortedFilters(List<TypeFiltersSearch> filters)
        {
            List<TypeFiltersSearch> filtersByIndex = filters.ToList().
                Where(e => e.Value.Contains('|')).ToList();
            List<TypeFiltersSearch> filtersWithoutIndex = filters.ToList().
                Where(e => !e.Value.Contains('|')).ToList();

            //Order By Index
            filtersByIndex.Sort((firstPair, nextPair) =>
            {
                return firstPair.Value[0].CompareTo(nextPair.Value[0]);
            });

            //Order By Cant
            filtersWithoutIndex.Sort((firstPair, nextPair) =>
            {
                return (-1*firstPair.Cant.CompareTo(nextPair.Cant));
            });            

            List<TypeFiltersSearch> filtersResultSorted = new List<TypeFiltersSearch>();

            foreach (var f in filtersByIndex)
            {
                f.Value = f.Value.Substring(2);
                filtersResultSorted.Add(f);
            }

            foreach (var f in filtersWithoutIndex)
                filtersResultSorted.Add(f);

            return filtersResultSorted;
        }

        public void UpdateViewCount(string index, string type, string id)
        {
            engine.IncreaseViewPortal(index, type, id);
        }

        public ActionResult AddBookmark(string index, string type, string id)
        {
            var user = ViewBag.Username as String;
            var status = engine.AddBookmark(index, type, id, user);

            return Json(status);
        }

        public ActionResult RemoveBookmark(string index, string type, string id)
        {
            var user = ViewBag.Username as String;
            var status = engine.RemoveBookmark(index, type, id, user);
            
            return Json(status);
        }

        public ActionResult GetSearchSuggest(string text) {
            var items = engine.GetSuggest(text);
          return Json(items, JsonRequestBehavior.AllowGet);

        }

    }
}