let menuItems = [
  {
    id: 1,
    name: "Chicken Samosa",
    price: 700,
    description: "Fresh Chicken Samosa",
    image: "/menu-items/Chicken Samosa.jpg"
  },
  {
    id: 2,
    name: "Beef Shahmi Kabaab",
    price: 1200,
    description: "Fresh Beef Shahmi Kabaab",
    image: "/menu-items/Beef Shahmi Kabaab.jpg"
  },
  {
    id: 3,
    name: "Pizza Roll",
    price: 1500,
    description: "Classic pizza Roll",
    image: "/menu-items/Pizza Roll.jpg"
  },
   {
    id: 4,
    name: "Chicken Seekh Kabab",
    price: 1000,
    description: "Fresh Chicken Seekh Kabab",
    image: "/menu-items/Chicken Seekh Kabab.jpg"
  },
  {
    id: 5,
    name: "Chicken Shami Kabab",
    price: 1000,
    description: "Fresh Chicken Shami Kabab",
    image: "/menu-items/Chicken Shami Kabab.jpg"
  },
  {
    id: 6,
    name: "Spring Roll",
    price: 1000,
    description: "Fresh Spring Roll",
    image: "/menu-items/Spring Roll.jpg"
  },
  {
    id: 7,
    name: "Tikka Roll",
    price: 1000,
    description: "Fresh Tikka Roll",
    image: "/menu-items/Tikka Roll.jpg"
  },
  {
    id: 8,
    name: "Cheese Roll Large",
    price: 1800,
    description: "Fresh Cheese Roll large size",
    image: "/menu-items/Cheese Roll.jpg"
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
