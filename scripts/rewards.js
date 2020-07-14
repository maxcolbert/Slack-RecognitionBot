const rewards = {
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

  listOfTypes() {
    return rewards.items.map(i => ({ text: i.name, value: i.id }));
  },

  listOfChoicesForOption(optionId) {
    return rewards.options.find(o => o.id === optionId).choices
      .map(c => ({ text: c.name, value: c.id }));
  },

  choiceNameForId(optionId, choiceId) {
    const option = rewards.options.find(o => o.id === optionId);
    if (option) {
      return option.choices.find(c => c.id === choiceId).name;
    }
    return false;
  },
};

module.exports = rewards;