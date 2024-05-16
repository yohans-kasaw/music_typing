with open('text.txt', 'r') as file:
    text = file.read()

text = text.replace('\n', '\\n')

print(text)
