// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
// import bcrypt from 'bcryptjs';
// import { z } from 'zod';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// const registerSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   username: z
//     .string()
//     .min(3, 'Username must be at least 3 characters')
//     .max(30, 'Username must be less than 30 characters')
//     .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   first_name: z.string().min(1, 'First name is required'),
//   last_name: z.string().min(1, 'Last name is required'),
// });

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
    
//     // Validate input
//     const validatedData = registerSchema.parse(body);

//     // Check if user exists
//     const { data: existingUser } = await supabase
//       .from('users')
//       .select('id')
//       .or(`email.eq.${validatedData.email},username.eq.${validatedData.username}`)
//       .single();

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User with this email or username already exists' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const password_hash = await bcrypt.hash(validatedData.password, 10);

//     // Create user
//     const { data: newUser, error } = await supabase
//       .from('users')
//       .insert({
//         email: validatedData.email,
//         username: validatedData.username,
//         password_hash,
//         first_name: validatedData.first_name,
//         last_name: validatedData.last_name,
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error('Supabase error:', error);
//       throw error;
//     }

//     // Remove password from response
//     const { password_hash: _, ...userWithoutPassword } = newUser;

//     return NextResponse.json(
//       { message: 'User registered successfully', user: userWithoutPassword },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error('Registration error:', error);
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: error.issues[0].message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: error.message || 'Registration failed' },
//       { status: 500 }
//     );
//   }
// }


// // src/app/api/auth/register/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
// import bcrypt from 'bcryptjs';
// import { z } from 'zod';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// const registerSchema = z.object({
//   email: z.string()
//     .email('Invalid email address')
//     .max(255, 'Email must be less than 255 characters'),
//   username: z
//     .string()
//     .min(3, 'Username must be at least 3 characters')
//     .max(30, 'Username must be less than 30 characters')
//     .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
//   password: z.string()
//     .min(8, 'Password must be at least 8 characters'),
//   first_name: z.string()
//     .min(1, 'First name is required')
//     .max(100, 'First name must be less than 100 characters'),
//   last_name: z.string()
//     .min(1, 'Last name is required')
//     .max(100, 'Last name must be less than 100 characters'),
//   role: z.enum(['user', 'admin']).optional().default('user'),
// });

// export async function POST(request: NextRequest) {
//   try {
//     console.log('========================================');
//     console.log('📝 Registration request received');
    
//     const body = await request.json();
//     console.log('📧 Email:', body.email);
//     console.log('👤 Username:', body.username);
//     console.log('🎭 Role requested:', body.role || 'user');
    
//     // Validate input
//     const validatedData = registerSchema.parse(body);

//     // Check if user exists
//     const { data: existingUser } = await supabase
//       .from('users')
//       .select('id')
//       .or(`email.eq.${validatedData.email},username.eq.${validatedData.username}`)
//       .single();

//     if (existingUser) {
//       console.log('❌ User already exists');
//       return NextResponse.json(
//         { error: 'User with this email or username already exists' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     console.log('🔐 Hashing password...');
//     const password_hash = await bcrypt.hash(validatedData.password, 10);

//     // Determine the role - default to 'user' if not specified or invalid
//     const userRole = validatedData.role === 'admin' ? 'admin' : 'user';
//     console.log('✅ Assigning role:', userRole);

//     // Create user with all fields matching database schema
//     const { data: newUser, error } = await supabase
//       .from('users')
//       .insert({
//         email: validatedData.email,
//         username: validatedData.username,
//         password_hash,
//         first_name: validatedData.first_name,
//         last_name: validatedData.last_name,
//         role: userRole,
//         is_active: true,
//         email_verified: false,
//         privacy_setting: 'public',
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error('❌ Supabase error:', error);
//       throw error;
//     }

//     console.log('✅ User created successfully');
//     console.log('  - User ID:', newUser.id);
//     console.log('  - Role:', newUser.role);
//     console.log('========================================');

//     // Remove password from response
//     const { password_hash: _, ...userWithoutPassword } = newUser;

//     return NextResponse.json(
//       { 
//         message: 'User registered successfully', 
//         user: userWithoutPassword 
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error('🔥 Registration error:', error);
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: error.issues[0].message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: error.message || 'Registration failed' },
//       { status: 500 }
//     );
//   }
// }


// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const registerSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
  first_name: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('========================================');
    console.log('📝 Registration request received');
    
    const body = await request.json();
    console.log('📧 Email:', body.email);
    console.log('👤 Username:', body.username);
    console.log('🎭 Role requested:', body.role || 'user');
    
    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${validatedData.email},username.eq.${validatedData.username}`)
      .single();

    if (existingUser) {
      console.log('❌ User already exists');
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const password_hash = await bcrypt.hash(validatedData.password, 10);

    // Determine the role - default to 'user' if not specified or invalid
    const userRole = validatedData.role === 'admin' ? 'admin' : 'user';
    console.log('✅ Assigning role:', userRole);

    // Create user with all fields matching database schema
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: validatedData.email,
        username: validatedData.username,
        password_hash,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        role: userRole,
        is_active: true,
        email_verified: false,
        privacy_setting: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log('✅ User created successfully');
    console.log('  - User ID:', newUser.id);
    console.log('  - Role:', newUser.role);
    console.log('========================================');

    // Remove password from response
    const { password_hash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { 
        message: 'User registered successfully', 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('🔥 Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}