using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CDM.Portal.PortalAppWeb.Models.CustomEntities
{
    public class TypeSearchResult
    {
        public string Type { get; set; }
        public List<ItemSearchResult> Items { get; set; }
    }
}