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

	public class UserMetadata
	{
		public string UserId { get; set; }

		public string GameId { get; set; }
	}

	public class GameHub : Hub
	{
		public UserMetadata GetUserMetadata()
		{
			string userId = this.Context.Items["UserId"] as string;
			string gameId = this.Context.Items["GameId"] as string;

			if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(gameId))
			{
				return null;
			}

			return new UserMetadata()
			{
				GameId = gameId,
				UserId = userId,
			};
		}

		public void SetGameMetadata(string userId, string gameId)
		{
			this.Context.Items["UserId"] = userId;
			this.Context.Items["GameId"] = gameId;
		}

		public async override Task OnDisconnectedAsync(Exception exception)
		{
			var userMetadata = this.GetUserMetadata();
			Log.Logger.LogError($"The client {JsonConvert.SerializeObject(userMetadata)} disconnected!");

			if (userMetadata == null)
			{
				// Nothing to do here
				return;
			}

			//await Groups.RemoveFromGroupAsync(Context.ConnectionId, userMetadata.GameId);
			GameTableEntity game = GameTable.GetGameObject(userMetadata.GameId);
			if (game == null)
			{
				// Nothing to do here
				return;
			}

			// Notify everyone user left
			await GameTable.RemoveUserFromGame(userMetadata.UserId, game);
			await Clients.Group(userMetadata.GameId).SendAsync("GameMetadataUpdate", JsonConvert.SerializeObject(game));
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
			if (string.IsNullOrEmpty(gameId) || string.IsNullOrEmpty(userId))
			{
				throw new Exception("GroupId or user is empty");
			}

			Log.Logger.LogInformation($"User {userId} requesting to join game {gameId}");

			GameTableEntity game = GameTable.GetGameObject(gameId);
			if (game == null)
			{
				// Join game as admin
				game = await GameTable.CreateGame(gameId, userId);
			} else
			{
				if (!game.GameEnded)
				{
					await GameTable.AddUserToGame(userId, game);
				}
			}

			this.SetGameMetadata(userId, gameId);

			// Add to group and update game metadata for everyone
			await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
			await Clients.Group(gameId).SendAsync("GameMetadataUpdate", JsonConvert.SerializeObject(game));
		}

		public async Task EndGame()
		{
			var userMetadata = this.GetUserMetadata();
			if (userMetadata == null)
			{
				throw new Exception("Game metadata is null");
			}

			GameTableEntity game = GameTable.GetGameObject(userMetadata.GameId);
			if (game == null)
			{
				throw new Exception("Game is null!");
			}

			if (userMetadata.UserId != game.LeaderUserId)
			{
				throw new Exception("Only leader can end!");
			}

			await GameTable.EndGame(game);

			await Clients.Group(userMetadata.GameId).SendAsync("GameMetadataUpdate", JsonConvert.SerializeObject(game));
		}
	}
}
