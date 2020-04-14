using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions.Open_Text
{
    /// <summary>
    /// A Group to store client sent Inputs In
    /// <para>All Inputs has to ne in a group</para>
    /// </summary>
    public class OpenText_Group
    {
        #region Public Properties

        /// <summary>
        /// The individual user inputs that belong to this group
        /// </summary>
        public List<OpenText_Input> Members { get; set; }

        /// <summary>
        /// The name of this group, takes its name from Member[0] if not set
        /// </summary>
        public string Title
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Title))
                    return Members[0].Title;
                else
                    return Title;
            }
            set
            {
                if (Equals(value, Members[0].Title))
                    Title = null;
                else
                    Title = value;
            }
        }

        #endregion Public Properties
    }
}