using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace CDM.Portal.PortalAppWeb.Helpers
{
    public static class JTokenExtensions
    {
        public static string ReadAsString(this JToken root, string path)
        {
            JToken leaf = root.GetChild(path);
            return leaf != null ? leaf.ToString() : null;
        }

        public static string[] ReadAsStringArray(this JToken root, string path)
        {
            JToken leaf = root.GetChild(path);
            return leaf != null ? (leaf as JArray).Values<String>().ToArray() : null;
        }

        public static void WriteValue(this JToken root, string path, object value)
        {
            JToken node;
            string childName;

            var parts = path.Split('/');
            if (parts.Length == 1)
            {
                node = root;
                childName = parts[0];
            }
            else
            {
                node = root.GetChild(parts.Take(parts.Length - 1).ToArray());
                childName = parts[parts.Length - 1];
            }

            if (node != null)
                node[childName] = new JValue(value);
        }


        private static JToken GetChild(this JToken root, string path)
        {
            var parts = path.Split('/');
            return root.GetChild(parts);
        }

        private static JToken GetChild(this JToken root, string[] parts)
        {
            var node = root;
            foreach (var part in parts)
            {
                node = node[part];
                if (node == null)
                    break;
            }
            return node;
        }
    }
}