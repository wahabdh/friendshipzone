let menuItems = [
  {
    id: 1,
    name: "Chicken Samosa",
    price: 700,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Chicken Samosa.jpg"
  },
  {
    id: 2,
    name: "Beef Shahmi Kabaab",
    price: 1200,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Beef Shahmi Kabaab.jpg"
  },
  {
    id: 3,
    name: "Pizza Roll",
    price: 1500,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Pizza Roll.jpg"
  },
   {
    id: 4,
    name: "Chicken Seekh Kabab",
    price: 1000,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Chicken Seekh Kabab.jpg"
  },
  {
    id: 5,
    name: "Chicken Shami Kabab",
    price: 1000,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Chicken Shami Kabab.jpg"
  },
  {
    id: 6,
    name: "Spring Roll",
    price: 1000,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Spring Roll.jpg"
  },
  {
    id: 7,
    name: "Tikka Roll",
    price: 1000,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Tikka Roll.jpg"
  },
  {
    id: 8,
    name: "Cheese Roll Large",
    price: 1800,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Cheese Roll.jpg"
  },
  {
    id: 9,
    name: "Aloo Samosa",
    price: 500,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Aloo Samosa.jpg"
  },
    {
    id: 10,
    name: "Potato Cheese Ball",
    price: 1000,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Potato Cheese Ball.jpg"
  },
   {
    id: 11,
    name: "Chicken Cheese Pops",
    price: 1000,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Chicken Cheese Pops.jpg"
  },
    {
    id: 12,
    name: "Chicken Lolly Pops",
    price: 1000,
    description: "12 Pcs Fresh & home made items",
    image: "/menu-items/Chicken Cheese Lolly Pops.jpg"
  }
];

export async function GET() {
  return Response.json(menuItems);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newItem = {
    id: Math.max(...menuItems.map(m => m.id), 0) + 1,
    ...body
  };
  menuItems.push(newItem);
  return Response.json(newItem, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const index = menuItems.findIndex(m => m.id === body.id);
  if (index === -1) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }
  menuItems[index] = body;
  return Response.json(body);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "");
  const index = menuItems.findIndex(m => m.id === id);
  if (index === -1) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }
  const deleted = menuItems.splice(index, 1);
  return Response.json(deleted[0]);
}
