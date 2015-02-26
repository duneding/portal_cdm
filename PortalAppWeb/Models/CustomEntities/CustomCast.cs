using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace CDM.Portal.PortalAppWeb.Models.CustomEntities
{
    public static class CustomCast
    {
        public static Dictionary<string, string> ConfigSectionToDictionary(string NameSection) {
            var section = (Hashtable)ConfigurationManager.GetSection(NameSection);
            Dictionary<string, string> dictionary = section.Cast<DictionaryEntry>().ToDictionary(d => (string)d.Key, d => (string)d.Value);
            return dictionary;        
        }
    }
}