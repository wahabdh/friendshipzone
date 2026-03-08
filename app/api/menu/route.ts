let menuItems = [
  {
    id: 1,
    name: "Samosa Roll",
    price: 1150,
    description: "Fresh veggie patty with lettuce and tomato",
    image: "/menu-items/Samosa Roll.jpg"
  },
  {
    id: 2,
    name: "Spicy Chicken Wrap",
    price: 280,
    description: "Tender chicken with spicy sauce and veggies",
    image: "/menu-items/chicken-wrap.jpg"
  },
  {
    id: 3,
    name: "Margherita Pizza",
    price: 350,
    description: "Classic pizza with mozzarella and basil",
    image: "/menu-items/pizza.jpg"
  },
   {
    id: 4,
    name: "Paneer Tikka",
    price: 320,
    description: "Grilled paneer with aromatic spices",
    image: "/menu-items/paneer-tikka.jpg"
  },
  {
    id: 5,
    name: "Fries special",
    price: 320,
    description: "Grilled paneer with aromatic spices",
    image: "/menu-items/fries.jpg"
  },
  {
    id: 6,
    name: "Biryani Special",
    price: 380,
    description: "Fragrant rice with tender meat pieces",
    image: "/menu-items/biryani.jpg"
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
