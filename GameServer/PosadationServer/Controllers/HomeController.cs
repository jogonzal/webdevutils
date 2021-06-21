using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Memory;
using PosadationServer.Logging;
using PosadationServer.Models;
using HtmlAgilityPack;
using Newtonsoft.Json;
using System.Net.Http;

namespace PosadationServer.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private static MemoryCache MemCache = new MemoryCache(new MemoryCacheOptions());

		public HomeController(ILogger<HomeController> logger)
		{
			_logger = logger;
		}

		private static HtmlNode CreateScriptElementWithSingleObject(string varName, object propertySet)
		{
			var htmlDoc = new HtmlDocument();
			HtmlNode elem = htmlDoc.CreateElement("script");

			var jsonString = JsonConvert.SerializeObject(propertySet);
			elem.AppendChild(htmlDoc.CreateTextNode($"var {varName} = {jsonString};"));

			return elem;
		}

		public string AppendScriptElementsToHtmlFile(string htmlFile, params HtmlNode[] scriptElementsToAdd)
		{
			var htmlDoc = new HtmlDocument();
			htmlDoc.LoadHtml(htmlFile);

			var head = htmlDoc.DocumentNode.SelectSingleNode("/html/head");

			// No base tag is present, we'll add a base override to the HTML file
			//string newContent = $@"<base href=""{baseHref}"" >";
			//HtmlNode newNode = HtmlNode.CreateNode(newContent);
			//head.PrependChild(newNode);

			// Uses the html served from the CDN with some adjustments
			if (scriptElementsToAdd != null)
			{
				foreach (var htmlNode in scriptElementsToAdd)
				{
					head.AppendChild(htmlNode);
				}
			}

			return htmlDoc.DocumentNode.OuterHtml;
		}

		public class CloudMetadata
		{
			public string Email { get; set; }
		}

		private static async Task<T> GetElementWithCacheCheck<T>(string key, Func<Task<T>> getElementFunc, int cacheExpiryInSeconds) where T : class
		{
			var cachedElement = MemCache.Get(key);
			if (cachedElement != null)
			{
				Log.Logger.LogInformation($"Cache hit for {key}");
				return cachedElement as T;
			}

			Log.Logger.LogInformation($"Cache miss for {key}");
			var element = await getElementFunc();
			if (element != null)
			{
				// Only cache if not null
				MemCache.Set(key, element, DateTimeOffset.Now.AddSeconds(cacheExpiryInSeconds)); // We have a 60s expiry time
			}
			return element;
		}


		private async Task<string> GetHtmlWithCacheCheck(string fileName)
		{
			return await GetElementWithCacheCheck<string>("HTMLFILE" + fileName, async () =>
			{
				using (var httpClient = new HttpClient())
				{
					string fileUrl;
#if DEBUG
					fileUrl = "http://localhost:8080/" + fileName;
#else
						fileUrl = "https://jorgewebdeployment.blob.core.windows.net/websocketgame/" + fileName;
#endif

					var result = await httpClient.GetAsync(fileUrl);
					return await result.Content.ReadAsStringAsync();
				}
			}, 60);
		}

		public async Task<IActionResult> Index()
		{
			Log.Logger.LogInformation("The home page loaded! :)");

			//var cookieContent = AuthContext.GetAuthCookie(HttpContext);
			//if (cookieContent == null)
			//{
			//	string authUrl = AuthUtils.GetGoogleAuthUtils(Request.GetUrl()).BuildUrl();
			//	return View("~/Views/Shared/SignIn.cshtml", new LoginPageModel(authUrl));
			//}

			Usuario registeredUser = new Usuario()
			{
				UsuarioClave="JorgeClave",
				LastModifiedByUser="",
				LastModifiedTime="",
				UsuarioAccesoAdmin=true,
				UsuarioLenguage="es-mx",
				UsuarioNombre="Jorge",
			};
			Sistema sistema = new Sistema();


			var htmlContent = await this.GetHtmlWithCacheCheck("index.html");
			string transformedHtml = AppendScriptElementsToHtmlFile(htmlContent,
				CreateScriptElementWithSingleObject("__cloudUser__", registeredUser),
				CreateScriptElementWithSingleObject("__cloudMetadata__", new CloudMetadata() { Email = "sample@gmail.com" }),
				CreateScriptElementWithSingleObject("__sistema__", sistema));

			return Content(transformedHtml, "text/html");
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
