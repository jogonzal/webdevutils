using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PosadationServer.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PosadationServer.Storage
{
	public class GameTableEntity : TableEntity
	{
		public GameTableEntity(string gameId)
		{
			this.PartitionKey = gameId;
			this.RowKey = gameId;
		}

		public GameTableEntity() {
			// For serialization
		}

		public string LeaderUserId { get; set; }
		public string UsersArray { get; set; }
	}

	public static class GameTable
	{
		public static string ConnectionString { get; set; }

		public static Lazy<CloudTable> getTableClient = new Lazy<CloudTable>(() =>
		{
			// Parse the connection string and return a reference to the storage account.
			CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);
			// Create the table client.
			CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
			CloudTable table = tableClient.GetTableReference("GameTable");
			// Create the table if it doesn't exist.
			table.CreateIfNotExists();
			return table;
		});

		private static CloudTable GetTableClient()
		{
			return getTableClient.Value;
		}


		public static GameTableEntity GetGameObject(string gameId)
		{
			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return null;
			}

			// Retrieve a reference to the table.
			CloudTable table = GetTableClient();

			TableOperation retrieve = TableOperation.Retrieve<GameTableEntity>(gameId, gameId);

			TableResult result = table.Execute(retrieve);

			if (result.HttpStatusCode == 404)
			{
				return null;
			}

			if (result.HttpStatusCode != 200)
			{
				throw new Exception(JsonConvert.SerializeObject(result));
			}

			return result.Result as GameTableEntity;
		}

		public static async Task<GameTableEntity> CreateGame(string gameId, string leaderId)
		{
			// Create a new entity.
			GameTableEntity entry = new GameTableEntity(gameId)
			{
				LeaderUserId = leaderId,
				UsersArray = JsonConvert.SerializeObject(new List<string>()),
			};

			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return entry;
			}

			try
			{
				// Retrieve a reference to the table.
				var table = GetTableClient();

				// Create the TableOperation object that inserts the entity
				await table.ExecuteAsync(TableOperation.Insert(entry));
				return entry;
			}
			catch (Exception error)
			{
				Log.Logger.LogInformation($"Ran into an error when updating history table {error.ToString()}");
				throw;
			}
		}

		public static async Task AddUserToGame(string userId, GameTableEntity entity)
		{
			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return;
			}

			try
			{
				// edit the entity
				List<string> users = JsonConvert.DeserializeObject<List<string>>(entity.UsersArray);
				if (users.Contains(userId))
				{
					return;
				}
				users.Add(userId);
				entity.UsersArray = JsonConvert.SerializeObject(users);

				// Retrieve a reference to the table.
				var table = GetTableClient();

				// Create the TableOperation object that updates the entity
				var result = await table.ExecuteAsync(TableOperation.Replace(entity));

				if (result.HttpStatusCode != 204)
				{
					throw new Exception(JsonConvert.SerializeObject(result));
				}
			}
			catch (Exception error)
			{
				Log.Logger.LogInformation($"Ran into an error when updating history table {error.ToString()}");
				throw;
			}
		}
	}
}
