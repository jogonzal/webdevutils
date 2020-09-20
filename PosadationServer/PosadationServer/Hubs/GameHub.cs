using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PosadationServer.Logging;
using PosadationServer.Models;
using PosadationServer.Storage;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Posadation.Hubs
{
	// Following this tutorial: https://docs.microsoft.com/en-us/aspnet/core/signalr/hubs?view=aspnetcore-2.1
	// More info on groups: https://docs.microsoft.com/en-us/aspnet/core/signalr/groups?view=aspnetcore-3.1

	public class GameHub : Hub
	{
		public async override Task OnDisconnectedAsync(Exception exception)
		{
			// On disconnect, notify the group
		}

		public async override Task OnConnectedAsync()
		{
			await base.OnConnectedAsync();

			var httpContext = Context.Features.Get<IHttpContextFeature>().HttpContext;

			if (httpContext == null)
			{
				throw new Exception("No HTTP context");
			}

			//var cookieContent = AuthContext.GetAuthCookie(httpContext);
			//var empresaCookieContent = CookieUtils.GetEmpresaCookieFromRequest(httpContext);
			//if (cookieContent == null || empresaCookieContent == null)
			//{
			//	throw new Exception("No cookies");
			//}

			//var etisysContext = EtisysContext.BuildEtisysContext(empresaCookieContent.Empresa);
			//if (etisysContext == null)
			//{
			//	throw new Exception("No context");
			//}
			//var userFromDb = await AuthContext.GetRegisteredUser(etisysContext, httpContext);
			//if (userFromDb == null)
			//{
			//	throw new Exception("No registered user");
			//}

			//await this.Clients.All.SendAsync("ReceiveMessage", $"{this.UserFromDb.UsuarioClave} has joined the chat");
		}

		public async Task CreateOrJoinGame(string gameId, string userId)
		{
			if (string.IsNullOrEmpty(gameId))
			{
				throw new Exception("GroupId is empty");
			}

			Log.Logger.LogInformation($"Requesting to join game {gameId}");

			GameTableEntity game = GameTable.GetGameObject(gameId);
			if (game == null)
			{
				// Join game as admin
				game = await GameTable.CreateGame(gameId, userId);
			} else
			{
				await GameTable.AddUserToGame(userId, game);
			}

			// Add to group and update game metadata for everyone
			await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
			await Clients.Group(gameId).SendAsync("GameMetadataUpdate", JsonConvert.SerializeObject(game));
		}
	}
}
