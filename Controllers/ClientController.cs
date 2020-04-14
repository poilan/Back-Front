using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Slagkraft.Models.Admin;
using Slagkraft.Models.Admin.Questions.Multiple_Choice;
using Slagkraft.Models.Admin.Questions.Open_Text;
using Slagkraft.Models.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Slagkraft.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        #region Private Fields

        private readonly DatabaseContext Context;

        #endregion Private Fields

        #region Public Constructors

        public ClientController(DatabaseContext context)
        {
            Context = context;
        }

        #endregion Public Constructors

        #region Public Methods

        [HttpPost("code-{code}/add-multiplechoice")]
        public void AddMultipleChoice(int code, [FromBody]MultipleChoice_Input input)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(input));
            }
            else
            {
                //Session not found
            }
        }

        [HttpPost("code-{code}/add-opentext")]
        public void AddOpenText(int code, [FromBody]OpenText_Input input)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(input));
            }
            else
            {
                //Session not found
            }
        }

        [HttpGet("code-{code}")]
        public bool CheckSession(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out _))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        #endregion Public Methods
    }
}