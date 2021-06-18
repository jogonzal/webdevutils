using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PosadationServer.Models
{
	public class Usuario
	{
		public string UsuarioClave { get; set; }
		public string UsuarioNombre { get; set; }
		public string UsuarioLenguage { get; set; }
		public string LastModifiedByUser { get; set; }
		public string LastModifiedTime { get; set; }
		public bool UsuarioAccesoAdmin { get; set; }
	}
}
