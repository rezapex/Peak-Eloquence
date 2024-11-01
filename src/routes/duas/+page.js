export async function load() {
	// In a real app, this would be fetched from an API
	return {
		categories: [
			{
				id: 'morning-evening',
				name: 'Morning & Evening',
				duas: [
					{
						id: 1,
						title: 'Morning Supplication',
						arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ',
						translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner',
						transliteration: 'Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallah wahdahu la shareeka lah',
						audio: 'https://audio.example.com/morning.mp3',
						reference: 'Abu Dawud 4:317'
					},
					{
						id: 2,
						title: 'Evening Supplication',
						arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ',
						translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner',
						transliteration: 'Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallah wahdahu la shareeka lah',
						audio: 'https://audio.example.com/evening.mp3',
						reference: 'Abu Dawud 4:317'
					}
				]
			},
			{
				id: 'protection',
				name: 'Protection',
				duas: [
					{
						id: 3,
						title: 'Protection from Evil',
						arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
						translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
						transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
						audio: 'https://audio.example.com/protection.mp3',
						reference: 'Muslim 4:2080'
					}
				]
			},
			{
				id: 'forgiveness',
				name: 'Forgiveness',
				duas: [
					{
						id: 4,
						title: 'Seeking Forgiveness',
						arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
						translation: 'My Lord, forgive me and accept my repentance, for You are the Ever-Accepting of repentance, the Most Merciful',
						transliteration: "Rabbi-ghfir li wa tub 'alayya innaka antat-tawwabur-rahim",
						audio: 'https://audio.example.com/forgiveness.mp3',
						reference: 'Bukhari 8:75:319'
					}
				]
			}
		]
	};
}