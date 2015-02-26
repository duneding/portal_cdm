using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CDM.Portal.PortalAppWeb.Models.CustomEntities
{
    public class ItemSearchResult
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string NameHighlight { get; set; }
        public string DescriptionHighlight { get; set; }
        public string Url { get; set; }
        public string Owner { get; set; }
        public string Type { get; set; }
        public string Index { get; set; }
        public string TypeEs { get; set; }
        public string Id { get; set; }
        public string DocType { get; set; }
        public bool Enable{ get; set; }
    }
}