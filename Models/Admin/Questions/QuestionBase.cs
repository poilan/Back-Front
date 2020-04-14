using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// The Abstract Base for all Question Types
    /// </summary>
    public abstract class QuestionBase
    {
        #region Protected Fields

        /// <summary>
        /// Lock to prevent bugs from MultiThreading Client Requests
        /// <para>We don't need things to run parellel, we just need them to not hog the main thread</para>
        /// </summary>
        protected readonly object QuestionLock = new object();

        #endregion Protected Fields

        #region Public Properties

        public int Index { get; set; }

        /// <summary>
        /// The type of question this is.
        /// </summary>
        public Type QuestionType { get; set; }

        /// <summary>
        /// The question that is asked.
        /// </summary>
        public string Title { get; set; }

        #endregion Public Properties

        #region Public Enums

        /// <summary>
        /// The types of questions that exists.
        /// </summary>
        public enum Type
        {
            OpenText,
            MultipleChoice,
        }

        #endregion Public Enums
    }
}