
import gaman from 'gaman';
import mainBlock from 'main.block';

gaman.serv({
	blocks: [mainBlock],
	server: {
		port: 3030,
	},
});
