# ABVerify.js
An extensive jQuery form verification plugin. Verify that forms have the correct data in them before allowing them to submit

**Dependencies:** jQuery

## Installing

1. Add the ABVerify.js file to a directory on your server
2. Add a `<script>` tag leading to the script

## Usage

On any `<form>` element in your HTML, use the jQuery method `.ABVerify()` on it, like so:

    $("form#myform").ABVerify();

This will initialize ABVerify on that form element. Now whenever the form is submitted ABVerify will cancel the form if it doesn't meet the requirements.

### Setting the requirements

How does ABVerify know what your form requirements are? Easy, it uses data attributes on the HTML elements of your form. We chose these because they can be easily changed with JavaScript and allow you to build forms and visualize them in the easiest way.

These are the available requirement types:

#### Main types:

- `required` - requires a value to be entered (accepts boolean - whether it is required or must be left blank)
- `max-length` - specify a length that the form must be under (accepts whole numbers)
- `min-length` - specify a length that the form must be under (accepts whole numbers)
- `equal-to` - requires the value of the input be equal to an object (accepts any string)
- `not-equal-to` - opposite of `equal-to` (accepts any string)

#### Number-specific types:

- `num-greater-than` - requires the value be greater than the specified number (accepts numbers)
- `num-greater-than-or-equal-to` - requires the value be greater than or equal to the specified number (accepts numbers)
- `num-less-than` - requires the value be less than the specified number (accepts numbers)
- `num-less-than-or-equal-to` - requires the value be less than or equal to the specified number (accepts numbers)
- `num-whole` - requires the number either be whole or not (accepts boolean - whether it must be whole or not)

If the value is not a number, all of these will fail.

#### Text-specific types:

- `text-contains` - requires the input contain specified text (accepts any string)
- `text-doesnt-contain` - requires the input does not contain specified text (accepts any string)
- `text-starts-with` - requires the input start with specified text (accepts any string)
- `text-doesnt-start-with` - requires the input does not start with specified text (accepts any string)
- `text-ends-with` - requires the input end with specified text (accepts any string)
- `text-doesnt-end-with` - requires the input does not end with specified text (accepts any string)

#### Type-checking types:

- `is-email-address` - requires the value either be an email address or not (accepts boolean - whether it must be an email or not)
- `is-url` - requires the value either be a URL or not (accepts boolean - whether it must be a URL or not)
- `is-number` - requires the value either be a number or not (accepts boolean - whether it must be a number or not)

These attributes go on your `<input>` or `<textarea>` elements with the prefix `data-abverify-`

For example, if I wanted to make a field that accepts a number, but it must be between 5 and 10, I would do the following:

    <input type="number" data-abverify-num-greater-than="5" data-abverify-num-less-than="10" />

Now the form won't submit until that number is between 5 and 10.

#### Custom verification messages

ABVerify will try and give your fields an appropriate message when it fails verification, but you can also add your own verification messages. Simply put the check name, with a suffix of `-message` and we will use that instead. In addition, if you want the form field to only have one message for all fails, instead of one message for each check failed, just use `data-abverify-message`.

**Examples:**

    <input type="number" data-abverify-num-greater-than="5" data-abverify-num-less-than="10" data-abverify-message="Your number must be between 5 and 10." />
    <input type="text" data-abverify-text-starts-with="John" data-abverify-text-doesnt-end-with="Smith" data-abverify-text-starts-with-message="Your name must start with 'John'" data-abverify-text-doesnt-end-with-message="Your name mustn't end with 'Smith'" />

### Styling

#### Failed input (required):

When an input does not meet requirements, it will get added the class `abverify-failed`. Please add this in your CSS. We recommend a red border or something of the sorts.

#### Verification fail message (recommended): 

When an input does not meet requirements, it will also get a message added right after it telling the user what they did wrong. You can style these with the class `abverify-fail-text`. It is recommended you do this, and make the colour red or something similar.

## Also important

Do not use this alone, as nothing client-side can't be spoofed by the user. Please add the appropriate server-side verification in as well.

## License

I don't give a shit how you use it, just please keep the first 6 lines (with my info) intact. You are free to modify to your needs as long as those stay intact as well.
