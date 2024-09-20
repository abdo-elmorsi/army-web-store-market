const development = {
	apiGateway: {}
}

const production = {
	apiGateway: {},
};

const config = process.env.NODE_ENV != "development" ? production : development;
export default config;