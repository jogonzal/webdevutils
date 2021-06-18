using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using PosadationServer.Logging;
using PosadationServer.Models;
using System;
using System.Threading.Tasks;

namespace Posadation.Hubs
{
	// Following this tutorial: https://docs.microsoft.com/en-us/aspnet/core/signalr/hubs?view=aspnetcore-2.1
	// More info on groups: https://docs.microsoft.com/en-us/aspnet/core/signalr/groups?view=aspnetcore-3.1

	public class ChatHub : Hub
	{
		private Usuario UserFromDb
		{
			get
			{
				return this.Context.Items["UserFromDb"] as Usuario;
			}
			set
			{
				this.Context.Items["UserFromDb"] = value;
			}
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

			this.UserFromDb = new Usuario()
			{
				UsuarioClave = Guid.NewGuid().ToString(),
			};
		}

		public async override Task OnDisconnectedAsync(Exception exception)
		{
			// TODO: find the user's group and disconnect from chat
			//await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
			//await this.Clients.All.SendAsync("ReceiveMessage", $"{this.UserFromDb.UsuarioClave} has left the chat");
		}

		public async Task SendMessage(string message, string groupId)
		{
			if (string.IsNullOrEmpty(groupId))
			{
				throw new Exception("GroupId is empty");
			}

			Log.Logger.LogInformation($"Websocket connected! '{this.UserFromDb.UsuarioClave}' says: '{message}'. Replying...");
			//await Clients.All.SendAsync("ReceiveMessage", $"{this.UserFromDb.UsuarioClave} says: {message}");
			await Clients.Group(groupId).SendAsync("ReceiveMessage", $"{this.UserFromDb.UsuarioClave} says: {message}");
		}

		public async Task JoinGroup(string groupId, string serializedData)
		{
			if (string.IsNullOrEmpty(groupId))
			{
				throw new Exception("GroupId is empty");
			}

			Log.Logger.LogInformation($"Requesting to join group {groupId}");

			await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
			await Clients.Group(groupId).SendAsync("ReceiveMessage", $"{this.UserFromDb.UsuarioClave} has joined the group '{groupId}' ");
			await Clients.Group(groupId).SendAsync("PeerToPeerConnection", serializedData);
		}

		public async Task LeaveGroup(string groupId)
		{
			if (string.IsNullOrEmpty(groupId))
			{
				throw new Exception("GroupId is empty");
			}

			Log.Logger.LogInformation($"Requesting to leave group {groupId}");

			await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
			await Clients.Group(groupId).SendAsync("ReceiveMessage", $"{this.UserFromDb.UsuarioClave} has left the group '{groupId}' ");
		}
	}
}
