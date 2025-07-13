
import gaman from 'gaman';
import mainBlock from 'main.block';
import nunjucks from '@gaman/nunjucks';

gaman.serv({
	blocks: [mainBlock],
	integrations: [nunjucks()],
	server: {
		port: 3030,
	},
});
