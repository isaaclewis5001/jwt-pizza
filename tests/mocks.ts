import { Page, Request } from "playwright/test";
import { expect } from "playwright-test-coverage";
import { Franchise, Menu, Order, OrderHistory, Role, User } from "../src/service/pizzaService";

async function authFromRequest(req: Request) {
    const x: string | null = await req.headerValue('Authorization');
    const prefix = "Bearer ";
    if (!x || !x.startsWith(prefix)) return "";
    return x.slice(prefix.length);
}

export class MockContext {
    private users: {[email: string]: {user: User, orders: OrderHistory}} = {};
    private auths: {[auth: string]: User} = {};
    
    constructor(initUsers: User[]) {
        initUsers.forEach(this.add_user.bind(this))
    }

    add_user(user: User) {
        this.users[user.email] = {user, orders: {id: "0", dinerId: user.id, orders: []}}
    }

    get_user(email: string): User {
        return this.users[email].user;
    }

    get_orders(email: string): OrderHistory {
        return this.users[email].orders;
    }

    login_user(user: User): string {
        const token = Math.floor(Math.random() * 1000000000).toString();
        this.auths[token] = user;
        return token;
    }

    logout_user(token: string) {
        delete this.auths[token];
    }

    token_to_user(token: string) {
        return this.auths[token];
    }

    place_order(user: User, order: Order) {
        this.users[user.email].orders.orders.push(order);
    }
}

export async function mockMenu(page: Page) {
    await page.route('*/**/api/order/menu', async (route) => {
        const menuRes: Menu = [
          { id: "1", title: 'Test Pizza 1', image: 'pizza1.png', price: 0.0038, description: 'A tester\'s first choice' },
          { id: "2", title: 'Test Pizza 2', image: 'pizza2.png', price: 0.0042, description: 'A tester\'s second choice' },
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: menuRes });
    });
}


export async function mockListFranchises(page: Page) {
    await page.route('*/**/api/franchise', async (route) => {
        const franchiseRes = [
            {
                id: 7, 
                name: "Spaghetti",
                stores: [
                    { id: 4, name: "Test store 3"},
                    { id: 1, name: "Test store 1"},
                ]
            },
            {
                id: 5, 
                name: "Linguini",
                stores: [
                    { id: 2, name: "Test store 2"},
                ]
            }
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });
}


export async function mockAuth(ctx: MockContext, page: Page) {
    await page.route('*/**/api/auth', async (route) => {
        const method = route.request().method();
        if (method == "POST") {
            const body = route.request().postDataJSON();
            expect(body.name).toBeDefined();
            expect(body.email).toBeDefined();
            expect(body.password).toBeDefined();
            const user: User = {
                id: "0",
                name: body.name,
                email: body.email,
                password: body.password,
                roles: [ {role: Role.Diner} ]
            };
            ctx.add_user(user);
            const token = ctx.login_user(user);
            await route.fulfill({json: {user, token}});
        }
        else if (method == "PUT") {
            const body = route.request().postDataJSON();
            expect(body.email).toBeDefined();
            expect(body.password).toBeDefined();
            const user = ctx.get_user(body.email);
            if (!user || user.password != body.password) {
                await route.fulfill({status: 404})
            }
            else {
                const token = ctx.login_user(user);
                await route.fulfill({json: {user, token}});
            }
        }
        else if (method == "DELETE") {
            const auth = await authFromRequest(route.request());
            ctx.logout_user(auth)
            await route.fulfill();
        }
        else {
            throw new Error("Bad method for auth")
        }
    });
}


export async function mockOrder(ctx: MockContext, page: Page) {
    await page.route('*/**/api/order', async (route) => {
        const method = route.request().method();
        if (method == "GET") {
            const auth = await authFromRequest(route.request());
            const user = ctx.token_to_user(auth);
            if (!user) {
                await route.fulfill({status: 401});
                return;
            }
            const orders = ctx.get_orders(user.email);
            await route.fulfill({json: {...orders, page: "1", id: undefined}})
        }
        else if (method == "POST") {
            const auth = await authFromRequest(route.request());
            const user = ctx.token_to_user(auth);
            if (!user) {
                await route.fulfill({status: 401});
                return;
            }
            const order = route.request().postDataJSON()
            ctx.place_order(user, order);
            await route.fulfill({json: {order, jwt: "jwt.goes.here"}})
        }
        else {
            throw new Error("Bad method for order")
        }
    });
}

export async function mockFranchise(page: Page) {
    await page.route('*/**/api/franchise', async (route) => {
        const method = route.request().method();
        if (method == "GET") {
            const franchises: Franchise[] = [
                {
                    id: "100",
                    admins: [
                        {id: "1", name: "admin", email: "a@jwt.com"}
                    ],
                    name: "Da Jawt",
                    stores: [
                        {
                            id: "10",
                            name: "Jawtteria",
                            totalRevenue: 0,
                        }
                    ]
                }
            ];
            await route.fulfill({json: franchises})
        }
        else if (method == "POST") {
            const body = route.request().postDataJSON();
            await route.fulfill({json: body});
        }
        else {
            throw new Error("Bad method for franchise")
        }
    });
    await page.route('*/**/api/franchise/*', async (route) => {
        const method = route.request().method();
        if (method == "DELETE") {
            route.fulfill({json: "franchise deleted"})
        }
        else if (method == "GET") {
            const franchises: Franchise[] = [
                {
                    id: "100",
                    admins: [
                        {id: "1", name: "admin", email: "a@jwt.com"}
                    ],
                    name: "Da Jawt",
                    stores: [
                        {
                            id: "10",
                            name: "Jawtteria",
                            totalRevenue: 100,
                        }
                    ]
                }
            ];
            route.fulfill({json: franchises})
        }
        else {
            throw new Error("Bad method for franchise with int")
        }
    });
}

export async function mockStore(page: Page) {
    await page.route("*/**/api/franchise/*/store", async (route) => {
        const method = route.request().method();
        if (method == "POST") {
            const body = route.request().postDataJSON();
            await route.fulfill({json: {...body, id: "1"}});
        }
        else {
            throw new Error("Bad method for store")
        }
    })
    await page.route("*/**/api/franchise/*/store/*", async (route) => {
        const method = route.request().method();
        if (method == "DELETE") {
            await route.fulfill({json: "store deleted"});
        }
        else {
            throw new Error("Bad method for store")
        }
    })
}

export async function mockVerify(ctx: MockContext, page: Page) {
    await page.route('*/**/api/order/verify', async (route) => {
        expect(route.request().method()).toBe('POST');
        await route.fulfill({json: {message: "valid"}});
    });
}

export async function mockDocs(ctx: MockContext, page: Page) {
    await page.route('*/**/api/docs', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({json: []});
    });
}




