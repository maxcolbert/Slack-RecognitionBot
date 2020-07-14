
const helloMsg = ':wave:  Hello! I\'m here to help you recognize amazing peers and facilitate feedback!'

const recognitionTxt = ':rocket:  Recognize & Reward!'
const recognitionTitle = 'Request a Recognition'

const recognition_action = 'make_recognition'
const recognition_confirm = 'confirm_recognition'
const recognition_finish = 'finish_recognition'

const acknowledgementTxt = ':clap:  Acknowledge Someone!'
const acknowledgementTitle = 'Create an Acknowledgement'
const acknowledgement_action = 'make_acknowledgement'

const rewardData = {
  items: [
    {
      id: 'amazon',
      name: 'Amazon',
      options: ['wishlist'],
    },
    {
      id: 'points',
      name: 'Points',
      options: ['numPoints'],
    },
    {
      id: 'wheel',
      name: 'Wheel',
      options: ['wheelType'],
    }
  ],
  options: [
    {
      id: 'wishlist',
      // choices: [
      // ],
    },
    {
      id: 'numPoints',
      choices: [
        {
          id: '10',
          name: '10',
        },
        {
          id: '25',
          name: '25',
        },
        {
          id: '50',
          name: '50',
        },
        {
          id: '100',
          name: '100',
        },
        {
          id: '250',
          name: '250',
        },
      ],
    },
    {
      id: 'wheelType',
      choices: [
        {
          id: 'amazon',
          name: 'Amazon',
        },
        {
          id: 'food',
          name: 'Food',
        },
        {
          id: 'all',
          name: 'All',
        },
      ],
    },
  ],
}

function rewardListOfTypes() {
    return rewardData.items.map(i => (
        // { text: i.name, value: i.id }
        {
            text:{
                type: 'plain_text',
                text: i.name
            },
            value: i.id
        }
    ));
}

function rewardListOfChoicesForOption(optionId) {
    return rewardData.options.find(o => o.id === optionId).choices
        .map(c => ({ text: c.name, value: c.id }));
}

function rewardChoiceNameForId(optionId, choiceId) {
    const option = rewardData.options.find(o => o.id === optionId);
    if (option) {
        return option.choices.find(c => c.id === choiceId).name;
    }
    return false;
}

module.exports = {
    rewardListOfTypes: rewardListOfTypes,

    rewardListOfChoicesForOption: rewardListOfChoicesForOption,

    rewardChoiceNameForId: rewardChoiceNameForId,

    short_message: context => {
        return {
            channel: context.channel,
            text: context.text
        }
    },
    welcome_message: context => {
        return {
            channel: context.channel,
            text: helloMsg,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: helloMsg
                    }
                },
                {
                    type: 'actions',
                    elements: [
                        {
                            action_id: recognition_action,
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: recognitionTxt
                            },
                            style: 'primary',
                            value: recognition_action
                        },
                        {
                            action_id: acknowledgement_action,
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: acknowledgementTxt
                            },
                            style: 'primary',
                            value: acknowledgement_action
                        },
                        {
                            action_id: 'dismiss',
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Dismiss'
                            },
                            value: 'dismiss'
                        }
                    ]
                }
            ]
        }
    },
    welcome_home: context => {
        return {
            type: 'home',
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: helloMsg
                    }
                },
                {
                    type: 'actions',
                    elements: [
                        {
                            action_id: recognition_action,
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: recognitionTxt
                            },
                            style: 'primary',
                            value: recognition_action
                        },
                        {
                            action_id: acknowledgement_action,
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: acknowledgementTxt
                            },
                            style: 'primary',
                            value: acknowledgement_action
                        }
                    ]
                }
            ]
        }
    },
    request_recognition: context => {
        return {
            type: 'modal',
            title: {
                type: 'plain_text',
                text: recognitionTitle
            },
            callback_id: recognition_action,
            blocks: [
                // {
                //     block_id: 'title',
                //     type: 'input',
                //     label: {
                //         type: 'plain_text',
                //         text: 'Title'
                //     },
                //     element: {
                //         action_id: 'title_id',
                //         type: 'plain_text_input',
                //         max_length: 100
                //     }
                // },
                {
                    block_id: 'user',
                    type: 'input',
                    label: {
                        type: 'plain_text',
                        text: 'User'
                    },
                    element: {
                        action_id: 'user_id',
                        type: 'users_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Name'
                        }
                    }
                },
                {
                    block_id: 'message',
                    type: 'input',
                    label: {
                        type: 'plain_text',
                        text: 'Message'
                    },
                    element: {
                        action_id: 'details_id',
                        type: 'plain_text_input',
                        multiline: true,
                        max_length: 500,
                        placeholder: {
                            type: 'plain_text',
                            text: 'Thanks for executing a great job!'
                        }
                    }
                },
                {
                    type: 'section',
                    block_id: 'reward',
                    text: {
                        type: 'plain_text',
                        text: 'Select Reward'
                    },
                    accessory:{
                        action_id: 'reward_id',
                        type: 'static_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Reward'
                        },
                        options: rewardListOfTypes()
                    }
                },
                {
                    block_id: 'approver',
                    type: 'input',
                    label: {
                        type: 'plain_text',
                        text: 'Select Approver'
                    },
                    element: {
                        action_id: 'approver_id',
                        type: 'users_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'User'
                        }
                    }
                },
                {
                    block_id: 'channel',
                    type: 'input',
                    label: {
                        type: 'plain_text',
                        text: 'Select Channels'
                    },
                    element: {
                        action_id: 'channel_id',
                        type: 'multi_external_select',
                        min_query_length: 0,
                        placeholder: {
                            type: 'plain_text',
                            text: '#general, #recognition'
                        }
                    }
                }
            ],
            submit: {
                type: 'plain_text',
                text: 'Next'
            }
        }
    },
    confirm_recognition: context => {
        return {
            response_action: 'push',
            view: {
                callback_id: recognition_confirm,
                type: 'modal',
                title: {
                    type: 'plain_text',
                    text: 'Confirm request'
                },
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `*TITLE*`
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: context.recognition.title
                        }
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `*DETAILS*`
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: context.recognition.details
                        }
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `*APPROVER*`
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `<@${context.recognition.approver}>`
                        }
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `*CHANNELS*`
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: context.recognition.channelString
                        }
                    }
                ],
                close: {
                    type: 'plain_text',
                    text: 'Back'
                },
                submit: {
                    type: 'plain_text',
                    text: 'Submit'
                },
                private_metadata: JSON.stringify(context.recognition)
            }
        }
    },
    finish_recognition: context => {
        return {
            response_action: 'update',
            view: {
                callback_id: recognition_finish,
                clear_on_close: true,
                type: 'modal',
                title: {
                    type: 'plain_text',
                    text: 'Success :tada:',
                    emoji: true
                },
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `Your recognition has been sent for approval.`
                        }
                    }
                ],
                close: {
                    type: 'plain_text',
                    text: 'Done'
                }
            }
        }
    },
    approve: context => {
        return {
            channel: context.channel,
            text: `Recognition approval is requested by <@${context.requester}>`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `<@${context.requester}> is requesting a recognition.`
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `>>> *TITLE*\n${context.title}\n\n*DETAILS*\n${context.details}`
                    }
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: `Requested channels: ${context.channelString}`
                        }
                    ]
                },
                {
                    type: 'actions',
                    elements: [
                        {
                            action_id: 'approve',
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Approve',
                                emoji: true
                            },
                            style: 'primary',
                            value: JSON.stringify(context)
                        },
                        {
                            action_id: 'reject',
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Reject',
                                emoji: true
                            },
                            style: 'danger',
                            value: JSON.stringify(context)
                        }
                    ]
                }
            ]
        }
    },
    rejected: context => {
        return {
            channel: context.channel,
            text: 'Your recognition has been rejected.',
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'Your recognition has been rejected.'
                    }
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `>>> *TITLE*\n${context.title}\n\n*DETAILS*\n${context.details}`
                    }
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: `Requested channels: ${context.channelString}`
                        }
                    ]
                }
            ]
        }
    },
    recognition: context => {
        return {
            channel: context.channel,
            text: `:loudspeaker: Recognition from: <@${context.requester}>`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*${context.title}*`
                    }
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: context.details
                    }
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: `:memo: Posted by <@${context.requester}>`
                        },
                        {
                            type: 'mrkdwn',
                            text: `:heavy_check_mark: Approved by <@${context.approver}>`
                        }
                    ]
                }
            ]
        }
    }

}