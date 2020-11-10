const { Message } = require("discord.js");

const paginationEmbed = async (msg, pages, emojiList = ['⏪', '⏩'], timeout = 120000) => {
	if (!msg && !msg.channel) throw new Error('No se puede acceder al canal');
	if (!pages) throw new Error('No pusiste paginas');
	if (emojiList.length !== 2) throw new Error('Necesitas 2 emojis');
	let page = 0;
	const curPage = await msg.author.send(pages[page].setFooter(`Pagina ${page + 1} / ${pages.length}`));
	for (const emoji of emojiList) await curPage.react(emoji);
	const reactionCollector = curPage.createReactionCollector(
		(reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
		{ time: timeout }
	);
	reactionCollector.on('collect', reaction => {
		reaction.users.remove(msg.author);
		switch (reaction.emoji.name) {
			case emojiList[0]:
				page = page > 0 ? --page : pages.length - 1;
				break;
			case emojiList[1]:
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		curPage.edit(pages[page].setFooter(`Pagina ${page + 1} / ${pages.length}`));
	});
	reactionCollector.on('end', () => curPage.reactions.removeAll());
	return curPage;
};
module.exports = paginationEmbed;
