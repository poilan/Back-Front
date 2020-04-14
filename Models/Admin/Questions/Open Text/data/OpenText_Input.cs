using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions.Open_Text
{
    /// <summary>
    /// The information we
    /// </summary>
    public class OpenText_Input
    {
        #region Public Properties

        /// <summary>
        /// The Main Data of the Input
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Optional Title
        /// <para>Becomes null if set to empty or whitespace</para>
        /// Returns Description if null
        /// </summary>
        public string Title
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Title))
                {
                    return Description;
                }
                else
                {
                    return Title;
                }
            }
            set
            {
                if (Equals(value, Description) || string.IsNullOrWhiteSpace(value))
                {
                    Title = null;
                }
                else
                {
                    Title = value;
                }
            }
        }

        /// <summary>
        /// The User that sent it in
        /// </summary>
        public string UserID { get; set; }

        #endregion Public Properties
    }
}