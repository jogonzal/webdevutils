using Microsoft.Extensions.Logging;

namespace WebDevServer.Logging
{
	public static class Log
	{
		private static ILoggerFactory BuildLogFactory()
		{
			var fact = LoggerFactory.Create(builder =>
			{
				builder.AddConsole();
			});
			return fact;
		}

		private static ILoggerFactory LogFactory = BuildLogFactory();

		public static ILogger Logger = LogFactory.CreateLogger("GenericLogger");
	}
}
