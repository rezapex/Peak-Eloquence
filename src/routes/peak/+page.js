export async function load() {
	// Simulated data - in a real app, this would come from an API
	return {
		categories: [
			{
				id: 'sermons',
				name: 'Sermons',
				items: [
					{
						id: 1,
						title: 'Sermon 1: Creation of Universe',
						arabic: 'الْحَمْدُ للهِ الَّذِي لاَ يَبْلُغُ مِدْحَتَهُ الْقَائِلُونَ',
						translation: 'Praise is due to Allah whose worth cannot be described by speakers',
						content: 'All praise is due to Allah, the Creator of great objects of creation, the One who cannot be praised properly by speakers, whose bounties cannot be counted by calculators and whose claim (to obedience) cannot be satisfied by those who attempt to do so...',
						reference: 'Nahj al-Balagha, Sermon 1'
					},
					{
						id: 2,
						title: 'Sermon 2: After the Death of the Prophet',
						arabic: 'أَمَّا بَعْدُ، فَإِنَّ اللهَ سُبْحَانَهُ بَعَثَ مُحَمَّداً(صلى الله عليه وآله)',
						translation: 'Indeed, Allah sent Muhammad (peace be upon him and his progeny)',
						content: 'Indeed Allah sent Muhammad (peace be upon him and his progeny) as a warner for all the worlds and a trustee of His revelation...',
						reference: 'Nahj al-Balagha, Sermon 2'
					}
				]
			},
			{
				id: 'letters',
				name: 'Letters',
				items: [
					{
						id: 3,
						title: 'Letter to Malik al-Ashtar',
						arabic: 'هذَا مَا أَمَرَ بِهِ عَبْدُ اللهِ عَلِيٌّ أَمِيرُ الْمُؤْمِنِينَ',
						translation: 'This is what Allah\'s servant Ali, Commander of the Faithful, has ordered Malik...',
						content: 'This is what Allah\'s servant Ali, Commander of the Faithful, has ordered Malik ibn al-Harith al-Ashtar in his instrument of appointment...',
						reference: 'Nahj al-Balagha, Letter 53'
					}
				]
			},
			{
				id: 'sayings',
				name: 'Wise Sayings',
				items: [
					{
						id: 4,
						title: 'On Knowledge',
						arabic: 'قِيمَةُ كُلِّ امْرِئٍ مَا يُحْسِنُهُ',
						translation: 'The worth of every person is in their knowledge',
						content: 'The worth of every person is in their knowledge. Knowledge is better than wealth...',
						reference: 'Nahj al-Balagha, Saying 81'
					}
				]
			}
		]
	};
}