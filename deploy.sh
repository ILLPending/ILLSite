echo "deploying ILL website to server..."

echo "Building..."
ng build

echo "Secure copy"
scp -r dist/impossible-level-list/* root@139.144.183.80:/var/www/impossible-list.com/

echo "Done! New website update successfully uploaded"