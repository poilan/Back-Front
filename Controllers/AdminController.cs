using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Slagkraft.Models.Database;
using Slagkraft.Services;
using System.Data.Entity;
using Slagkraft.Models.Admin;
using Slagkraft.Models.Admin.Questions;
using Slagkraft.Models.Admin.Questions.Open_Text;
using Slagkraft.Models.Admin.Questions.Multiple_Choice;

namespace Slagkraft.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        #region Private Fields

        private readonly DatabaseContext _context;

        #endregion Private Fields

        #region Public Methods

        [HttpPost("create")]
        public async Task CreateSession([FromBody]Session data)
        {
            if (string.IsNullOrWhiteSpace(data.Title))
            {
                HttpContext.Response.StatusCode = 406;
                return;
            }

            if (_context == null)
            {
                HttpContext.Response.StatusCode = 202;
                return;
            }

            Session last = _context.Sessions.Last();
            data.Identity = last.Identity + 1;

            data.Questions = "{}";
            data.Settings = "{}";
            data.Slides = "{}";

            await _context.Sessions.AddAsync(data);
            await _context.SaveChangesAsync();

            HttpContext.Response.StatusCode = 202;
        }

        [HttpGet("{code}/questions-{index}")]
        public QuestionBase GetQuestion(int code, int index)
        {
            if (_context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 202;
                switch (admin.Questions[index].QuestionType)
                {
                    default:
                    case QuestionBase.Type.OpenText:
                        return admin.Questions[index] as OpenText;

                    case QuestionBase.Type.MultipleChoice:
                        return admin.Questions[index] as MultipleChoice;
                }
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return null;
            }
        }

        [HttpGet("{code}/questions-all")]
        public IEnumerable<QuestionBase> GetQuestions(int code)
        {
            if (_context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 202;
                return admin.Questions;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return null;
            }
        }

        [HttpGet("sessions-{email}")]
        public async Task<IEnumerable<Session>> GetSessions(string email)
        {
            if (_context == null)
            {
                List<Session> instances = new List<Session>();

                Session session1 = new Session
                {
                    Identity = 123123,
                    Owner = "erlend.marcus@gmail.com",
                    Title = "Test one - No Database",
                    Settings = "",
                    Slides = "",
                    Questions = "",
                    User = null,
                    LastOpen = DateTime.Now.ToString(),
                };

                Session session2 = new Session
                {
                    Identity = 234234,
                    Owner = "erlend.marcus@gmail.com",
                    Title = "Test two - No Database",
                    Settings = "",
                    Slides = "",
                    Questions = "",
                    User = null,
                    LastOpen = DateTime.Now.ToString(),
                };

                Session session3 = new Session
                {
                    Identity = 345345,
                    Owner = "erlend.marcus@gmail.com",
                    Title = "Test three - No Database",
                    Settings = "",
                    Slides = "",
                    Questions = "",
                    User = null,
                    LastOpen = DateTime.Now.ToString(),
                };

                instances.Add(session1);
                instances.Add(session2);
                instances.Add(session3);
                return instances;
            }

            List<Session> sessions = await _context.Sessions.ToListAsync();

            List<Session> userSessions = new List<Session>();

            foreach (Session session in sessions)
            {
                if (session.Owner == email)
                {
                    userSessions.Add(session);
                }
            }
            return sessions;
        }

        [HttpGet("{code}/slides-all")]
        public IEnumerable<QuestionBase> GetSlides(int code)
        {
            if (_context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 202;
                return admin.Questions;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return null;
            }
        }

        [HttpGet("{code}/slides-{index}")]
        public IEnumerable<QuestionBase> GetSlides(int code, int index)
        {
            if (_context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 202;
                return admin.Questions;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return null;
            }
        }

        [HttpPost("load-{code}")]
        public async void LoadSession(int code)
        {
            if (_context == null)
            {
                ActiveSessions active = ActiveSessions.Instance;
                if (active.Sessions.TryGetValue(code, out AdminInstance admin1))
                {
                    HttpContext.Response.StatusCode = 200;
                    return; //Session already active?
                }
                else
                {
                    HttpContext.Response.StatusCode = 404;
                    return; //Session doesn't exist!
                }
            }

            if (_context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 200;
                return; //Session already active?
            }
            else
            {
                Session session = await _context.Sessions.FindAsync(code);
                if (session == null)
                {
                    HttpContext.Response.StatusCode = 404;
                    return; //Session doesn't exist!
                }

                AdminInstance model = new AdminInstance();
                model.LoadSession(session.Questions);

                _context.Active.Sessions.Add(code, model);
                HttpContext.Response.StatusCode = 201;
                return; //Loaded from database
            }
        }

        #endregion Public Methods

        #region Private Methods

        private async void StreamSessions(Stream stream, CancellationToken aborted, string email)
        {
            using var writer = new StreamWriter(stream);
            while (true)
            {
                if (aborted.IsCancellationRequested)
                    return;

                List<Session> sessions = await _context.Sessions.ToListAsync();

                List<Session> userSessions = new List<Session>();

                foreach (Session session in sessions)
                {
                    if (session.Owner == email)
                    {
                        userSessions.Add(session);
                    }
                }
            }
        }

        private void WriteEvent(TextWriter writer, string eventType, string data)
        {
            if (!string.IsNullOrEmpty(eventType))
            {
                writer.WriteLine("event:" + eventType);
            }
            writer.WriteLine("data:" + data);
            writer.WriteLine();
            writer.Flush(); // StreamWriter.Flush calls Flush on underlying Stream
        }

        #endregion Private Methods
    }
}