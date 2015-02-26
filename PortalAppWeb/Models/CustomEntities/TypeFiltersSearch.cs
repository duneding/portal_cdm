using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CDM.Portal.PortalAppWeb.Models.CustomEntities
{
    public class TypeFiltersSearch
    {
        public string Text { get; set; }
        public string Value { get; set; }
        public int Cant { get; set; }
    }

    public class TypeActives
    {
        public string Value { get; set; }
        public bool Active { get; set; }
    }

}