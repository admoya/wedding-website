CURRENT=0
for i in static/Pictures/*
do
    mv -- "$i" "static/Pictures/${CURRENT}.jpg"
    ((CURRENT+=1))
done