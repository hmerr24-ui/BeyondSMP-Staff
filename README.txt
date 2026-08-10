BEYOND SMP STAFF PORTAL V2 — USERNAME LOGIN

This version has a username-only UI. Staff never enter an email address.

IMPORTANT
The username/password bridge uses a Supabase Edge Function. The Edge Function
is the only place that may contain SUPABASE_SERVICE_ROLE_KEY. NEVER put that
secret in config.js, index.html, JavaScript served by GitHub Pages, or GitHub
Pages repository files.

SETUP ORDER
1. Create a Supabase project.
2. Run schema.sql in Supabase SQL Editor.
3. Deploy the supplied supabase_staff_login.ts as an Edge Function named staff-login.
4. Add Edge Function secrets:
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
5. Create your first internal Supabase Auth user using the internal email format:
   <yourusername>@staff.beyond-smp.internal
   Use your chosen password. This email is internal and is never displayed by
   the website.
6. Copy that Auth user's UUID.
7. Insert your profile:
   insert into public.staff_profiles(id,username,display_name,role)
   values ('YOUR_UUID','yourusername','Your Display Name','owner');
8. In config.js, put only the Supabase project URL and publishable key.
9. Upload the website files to GitHub Pages.
10. Set the GitHub Pages custom domain to staff.beyond-smp.com.
11. Test login with the username and password only.

USERNAME RULE
Store usernames in lowercase. The login function normalizes input to lowercase.

DO NOT share the internal @staff.beyond-smp.internal address with staff or put it
in the website UI.

NEXT
Connect apply.beyond-smp.com to the applications table through a secure submission
endpoint, then implement the application list, accept/decline actions, staff
management and audit logging in the portal.
