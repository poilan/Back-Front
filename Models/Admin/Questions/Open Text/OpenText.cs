using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions.Open_Text
{
    /// <summary>
    /// The Primary Class for all OpenText Polls
    /// <para>Contains all the logic used in OpenText Polls</para>
    /// </summary>
    public class OpenText : QuestionBase
    {
        #region Public Properties

        /// <summary>
        /// "Removed" inputs are stored here
        /// </summary>
        public List<OpenText_Input> Archive { get; set; }

        /// <summary>
        /// All groups of inputs
        /// </summary>
        public List<OpenText_Group> Groups { get; set; }

        #endregion Public Properties

        #region Public Structs

        /// <summary>
        /// Stores two integers that allows us to locate specified inputs.
        /// </summary>
        public struct Key
        {
            #region Public Fields

            /// <summary>
            /// The Group Index the Input has
            /// </summary>
            public int Group;

            /// <summary>
            /// The Member Index the Input has
            /// </summary>
            public int Member;

            #endregion Public Fields
        }

        #endregion Public Structs

        #region Public Constructors

        public OpenText()
        {
            Archive = new List<OpenText_Input>();
            Groups = new List<OpenText_Group>();

            AddGroup("Unorganized");
        }

        #endregion Public Constructors

        #region Public Methods

        /// <summary>
        /// Creates a new group for us
        /// </summary>
        /// <param name="title">The name the group should have</param>
        public void AddGroup(string title)
        {
            lock (QuestionLock)
            {
                OpenText_Group group = new OpenText_Group
                {
                    Title = title,
                    Members = new List<OpenText_Input>(),
                };
                Groups.Add(group);
            }
        }

        /// <summary>
        /// This method is how users add new input
        /// </summary>
        /// <param name="input">The Input the user sent us.</param>
        public void AddUserInput(OpenText_Input input)
        {
            lock (QuestionLock)
            {
                Groups[0].Members.Add(input);
            }
        }

        /// <summary>
        /// Merges two inputs into one another
        /// </summary>
        /// <param name="parent">This is the input that will still be visible</param>
        /// <param name="child">This input will be hidden inside parent</param>
        public void Merge(Key parent, Key child)
        {
            lock (QuestionLock)
            {
                //Check if parent is already merged with something
                if (Groups[parent.Group].Members[parent.Member] is OpenText_Merged mergedParent)
                {
                    //Check if child is merged with something
                    if (Groups[child.Group].Members[child.Member] is OpenText_Merged mergedChild)
                    {
                        //Seperate the child from all the grand-kids(The childs children)
                        OpenText_Input singleChild = new OpenText_Input
                        {
                            Description = mergedChild.Description,
                            Title = mergedChild.Title,
                            UserID = mergedChild.UserID,
                        };

                        //Gather the grand-kids
                        List<OpenText_Input> grandKids = mergedChild.Children;

                        //Add child and all grand-kids to parent
                        mergedParent.Children.Add(singleChild);

                        foreach (OpenText_Input kid in grandKids)
                        {
                            mergedParent.Children.Add(kid);
                        }
                    }
                    else
                    {
                        //Add the Child to parent
                        mergedParent.Children.Add(Groups[child.Group].Members[child.Member]);
                    }
                    //Remove the child from its old location
                    Groups[child.Group].Members.RemoveAt(child.Member);
                }
                else
                {
                    //Make parent into a merged Input
                    OpenText_Merged merge = new OpenText_Merged
                    {
                        Children = new List<OpenText_Input>(),
                        Description = Groups[parent.Group].Members[parent.Member].Description,
                        Title = Groups[parent.Group].Members[parent.Member].Title,
                        UserID = Groups[parent.Group].Members[parent.Member].UserID,
                    };

                    //Add child to new parent
                    merge.Children.Add(Groups[child.Group].Members[child.Member]);
                }
            }
        }

        /// <summary>
        /// Moves a input to the desired index within its group
        /// </summary>
        /// <param name="input">The Input-Key to the input you want moved</param>
        /// <param name="target">The new Index you want the input to have</param>
        public void MoveInput(Key input, int target)
        {
            lock (QuestionLock)
            {
                //Grab the Input we want moved
                OpenText_Input holder = Groups[input.Group].Members[input.Member];

                if (input.Member < target) //If we are moving it to a higher index (Down the list)
                {
                    for (int i = input.Member; i < target; i++)
                    {
                        Groups[input.Group].Members.Insert(i, Groups[input.Group].Members[i + 1]);
                    }
                }
                else if (input.Member > target) //If we are moving it to a lower index (Up the list)
                {
                    for (int i = input.Member; i > target; i--)
                    {
                        Groups[input.Group].Members.Insert(i, Groups[input.Group].Members[i - 1]);
                    }
                }

                //Finally put the input into the desired spot
                Groups[input.Group].Members.Insert(target, holder);
            }
        }

        /// <summary>
        /// Method that Switches Group and places the input in the desired location.
        /// </summary>
        /// <param name="input">The Input-Key to the input you want moved</param>
        /// <param name="targetGroup">The Group you want it moved too</param>
        /// <param name="targetIndex">The Index you want it to have in the new group</param>
        public void PlaceInput(Key input, int targetGroup, int targetIndex)
        {
            SwitchGroup(input, targetGroup);
            MoveInput(input, targetIndex);
        }

        /// <summary>
        /// Renames the specified group
        /// </summary>
        /// <param name="title">The new name of the group</param>
        /// <param name="groupNumber">The index of the group you want moved</param>
        public void RenameGroup(string title, int groupNumber)
        {
            lock (QuestionLock)
            {
                Groups[groupNumber].Title = title;
            }
        }

        /// <summary>
        /// Switches the group of a specified index
        /// </summary>
        /// <param name="input">The Input-Key to the input you want moved</param>
        /// <param name="targetGroup">The Index of the Group you want the input moved to</param>
        public void SwitchGroup(Key input, int targetGroup)
        {
            lock (QuestionLock)
            {
                //Grab the Input we want moved
                OpenText_Input Input = Groups[input.Group].Members[input.Member];

                //Remove it from its old location
                Groups[input.Group].Members.RemoveAt(input.Member);

                //Add it to the desired group
                Groups[targetGroup].Members.Add(Input);
            }
        }

        /// <summary>
        /// Unmerges all the inputs in a merged input
        /// </summary>
        /// <param name="target">The Input Key to the Input you want Unmerged</param>
        public void Unmerge(Key target)
        {
            lock (QuestionLock)
            {
                //Check if target is a merged input
                if (Groups[target.Group].Members[target.Member] is OpenText_Merged merged)
                {
                    //Add all the children to the same group
                    foreach (OpenText_Input inp in merged.Children)
                    {
                        Groups[target.Group].Members.Add(inp);
                    }

                    //Make target into a normal input
                    OpenText_Input parent = new OpenText_Input
                    {
                        Description = merged.Description,
                        Title = merged.Title,
                        UserID = merged.UserID,
                    };

                    //Put the new target into its old place.
                    Groups[target.Group].Members.Insert(target.Member, parent);
                }
            }
        }

        #endregion Public Methods
    }
}