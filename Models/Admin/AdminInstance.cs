using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Slagkraft.Models.Admin.Questions;
using Slagkraft.Models.Admin.Questions.Multiple_Choice;
using Slagkraft.Models.Admin.Questions.Open_Text;
using Newtonsoft.Json;
using Slagkraft.Models.Admin.Slides;

namespace Slagkraft.Models.Admin
{
    public class AdminInstance
    {
        #region Public Properties

        public int Active { get; set; }
        public bool Open { get; set; }
        public string Owner { get; set; }
        public List<QuestionBase> Questions { get; set; }
        public int SessionIdentity { get; set; }
        public List<Slide> Slides { get; set; }

        #endregion Public Properties

        #region Public Constructors

        public AdminInstance()
        {
            Active = 0;
            Open = false;
            Questions = new List<QuestionBase>();
            Slides = new List<Slide>();
        }

        #endregion Public Constructors

        #region Public Methods

        public void AddClientInput(object clientInput)
        {
            if (clientInput is OpenText_Input Open)
            {
                if (Questions[Active] is OpenText Text)
                {
                    Text.AddUserInput(Open);
                    return;
                }
            }

            if (clientInput is MultipleChoice_Input Multi)
            {
                if (Questions[Active] is MultipleChoice Choice)
                {
                    Choice.AddUserVote(Multi);
                }
            }
        }

        public void AddQuestion(QuestionBase question)
        {
            question.Index = Questions.Count;
            if (question is OpenText)
                question.QuestionType = QuestionBase.Type.OpenText;
            else if (question is MultipleChoice)
                question.QuestionType = QuestionBase.Type.MultipleChoice;

            Questions.Add(question);
        }

        public QuestionBase GetActiveQuestion()
        {
            switch (Questions[Active].QuestionType)
            {
                case QuestionBase.Type.OpenText:
                    return Questions[Active] as OpenText;

                case QuestionBase.Type.MultipleChoice:
                    return Questions[Active] as MultipleChoice;

                default:
                    return null;
            }
        }

        public void LoadSession(string questionJson)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All
            };
            List<QuestionBase> questions = JsonConvert.DeserializeObject<List<QuestionBase>>(questionJson, settings);
            Questions = questions;
        }

        public string SaveSession()
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All
            };
            string json = JsonConvert.SerializeObject(Questions, settings);

            return json;
        }

        public void Start(int index)
        {
        }

        public void Stop()
        {
        }

        #endregion Public Methods
    }
}