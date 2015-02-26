using System.Web;
using System.Web.Optimization;

namespace CDM.Portal.PortalAppWeb
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-1.11.1.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/spcontext").Include(
                        "~/Scripts/spcontext.js"));

            bundles.Add(new ScriptBundle("~/bundles/jsincludes").Include(
                       "~/Scripts/GrillasCvg/GrillasCvg.js",
                       "~/Scripts/JsRender.js",
                       "~/Scripts/typeahead.js",                       
                       "~/Scripts/main.js"
                       ));

            bundles.Add(new StyleBundle("~/Content/bootstrap")
                .Include("~/Content/bootstrap.css")
            );

            bundles.Add(new StyleBundle("~/Content/bootstrap-thememin")
                .Include("~/Content/bootstrap-theme.min.css")
            );

            bundles.Add(new StyleBundle("~/Content/css/styles")
                .Include("~/Content/css/styles.css")
            );

            // Force EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            //BundleTable.EnableOptimizations = true;
        }
    }
}
