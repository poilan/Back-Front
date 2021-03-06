﻿using Slagkraft.Models.Admin.Questions.Open_Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions.Multiple_Choice
{
    /// <summary>
    /// The Primary Class for Multiple Choice Votes
    /// <para>This class holds all the logic used in Multiple Choice</para>
    /// </summary>
    public class MultipleChoice : QuestionBase
    {
        #region Public Properties

        /// <summary>
        /// "Removed" options are stored here.
        /// </summary>
        public List<MultipleChoice_Option> Archive { get; set; }

        /// <summary>
        /// The options you can pick from
        /// </summary>
        public List<MultipleChoice_Option> Options { get; set; }

        /// <summary>
        /// The total number of votes
        /// </summary>
        public int TotalVotes
        {
            get
            {
                int i = 0;
                foreach (MultipleChoice_Option opt in Options)
                {
                    i += opt.Votes.Count;
                }
                return i;
            }
        }

        #endregion Public Properties

        #region Public Constructors

        public MultipleChoice()
        {
            Archive = new List<MultipleChoice_Option>();
            Options = new List<MultipleChoice_Option>();
        }

        #endregion Public Constructors

        #region Public Methods

        /// <summary>
        /// Adds another option to the vote
        /// </summary>
        /// <param name="input">A Open Text input, that it takes the data from</param>
        public void AddOption(OpenText_Input input)
        {
            lock (QuestionLock)
            {
                MultipleChoice_Option option = new MultipleChoice_Option
                {
                    Archive = new List<MultipleChoice_Input>(),
                    Votes = new List<MultipleChoice_Input>(),
                    Description = input.Description,
                    UserID = input.UserID,
                    Title = input.Title,
                };

                Options.Add(option);
            }
        }

        /// <summary>
        /// Adds a User input to the targeted option
        /// </summary>
        /// <param name="input">The Vote the user sent in</param>
        public void AddUserVote(MultipleChoice_Input input)
        {
            lock (QuestionLock)
            {
                Options[input.Option].Votes.Add(input);
            }
        }

        /// <summary>
        /// Removes one of the options
        /// </summary>
        /// <param name="option">The index of the option you want removed</param>
        public void RemoveOptions(int option)
        {
            lock (QuestionLock)
            {
                Options.RemoveAt(option);
            }
        }

        #endregion Public Methods
    }
}