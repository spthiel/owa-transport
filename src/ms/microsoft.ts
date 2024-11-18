const baseURL = BASE_URL;

function getCookieValue(name: string)
{
	const regex = new RegExp(`(^| )${name}=([^;]+)`)
	const match = document.cookie.match(regex)
	if (match) {
		return match[2]
	}
}


function getCanaryCookie(): string {
	const cookie = getCookieValue("X-OWA-CANARY");
	if (!cookie) {
		throw new Error('No canary cookie found')
	}
	return cookie;
}

function fetchService(action: string, data: object) {
	const URLPostData = encodeURIComponent(JSON.stringify(data));
	const headers = new Headers();
	
	headers.append('action', action);
	headers.append('x-owa-canary', getCanaryCookie());
	headers.append('x-owa-urlpostdata', URLPostData);
	
	return fetch(`${baseURL}/owa/service.svc`, {
		method: "GET",
		headers: headers
	})
}

export {
	fetchService
}