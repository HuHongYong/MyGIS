using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyGIS.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// GIS页面
        /// </summary>
        /// <returns></returns>
        public ActionResult IndexGIS() {
            return View();
        }
    }
}