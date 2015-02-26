using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CDM.Portal.PortalAppWeb.Models.CustomEntities
{
    public class ItemsAlsoSearched
    {
        /*
         "_source": {
    "term": "as",
    "last": "2014-12-17T00:00:00-05:00",
    "no_results": 893,
    "no_searches": 4,
    "indexes": []
  },
         */

        public string term { get; set; }
        public string last { get; set; }
        public string no_results { get; set; }
        public string no_searches { get; set; }

    }
}