require FILE::Temp;
use FILE::Temp qw( tempfile );
=pod

=head1 L<$_$|https://esolangs.org/wiki/$_$>

=head2 Commandline Args

=over

=item <inline script> = execute inline script

=item -f <filename> = run script in I<filename>

=back

=head2 Definitions

I<s> - Built-in variable. Empty string.

I<N> - The number of characters.

=head2 Commands
 
I<(ORDER is important!)>

=over

=item 1.  C<_> : Append the character with the ASCII value I<N> to I<s>.

=item 2.  C<-> : Like C<_>, but prepend the character to I<s> instead.

=item 3.  C<$> : Print the value of I<s>, and if I<N> is odd, reset it to an empty string.

=item 4.  C<&> : Separate calls of the same character.

=item 5.  C<@> : Create label I<N>.

=item 6.  C<!> : Assign the most recently created label to the I<N>'th character call.

=item 7.  C<#> : Go to Label I<N>.

=item 8.  C<.> : Stop executing.

=item 9.  C<%> : Begin or end a comment.

=item 10. C<?> : Ask the user for input and append it to I<s>.

=item 11. C<+> : Append the source of the (I<N>-1)th call in the program to I<s>. If I<N> is 1, the entire source code is stored in I<s>.

=item 12. C<1> : Begin defining a new miniprogram I<N>.

=item 13. C<2> : Stop defining miniprogram I<N>.

=item 14. C<3> : Add the I<N>th character in this list to the miniprogram. Followed by a I<4> call.

=item 15. C<4> : Determines I<N> for the character added in the previous I<3> call as the I<N> of this I<4> call.

=item 16. C<5> : Run miniprogram I<N>.

=item 17. C<z> : Wait I<N> seconds.

=item 18. C<;> : Print the lyrics to All Star by Smash Mouth I<N> times.

=item 13. C<*> : Interpret I<s> as source code. Inspired by L<InterpretMe|https://esolangs.org/wiki/InterpretMe>

=back  

=cut

use warnings;
use strict;


my $allstar = <<'END';
Somebody once told me the world is gonna roll me
I ain\'t the sharpest tool in the shed
She was looking kind of dumb with her finger and her thumb
In the shape of an \'L\' on her forehead
Well the years start coming and they don\'t stop coming
Fed to the rules and I hit the ground running
Didn\'t make sense not to live for fun
Your brain gets smart but your head gets dumb
So much to do, so much to see
So what\'s wrong with taking the back streets?
You\'ll never know if you don\'t go
You\'ll never shine if you don\'t glow
Hey now, you\'re an all-star, get your game on, go play
Hey now, you\'re a rock star, get the show on, get paid
And all that glitters is gold
Only shooting stars break the mold
It\'s a cool place and they say it gets colder
You\'re bundled up now, wait till you get older
But the meteor men beg to differ
Judging by the hole in the satellite picture
The ice we skate is getting pretty thin
The water\'s getting warm so you might as well swim
My world\'s on fire, how about yours?
That\'s the way I like it and I never get bored
Hey now, you\'re an all-star, get your game on, go play
Hey now, you\'re a rock star, get the show on, get paid
All that glitters is gold
Only shooting stars break the mold
Hey now, you\'re an all-star, get your game on, go play
Hey now, you\'re a rock star, get the show, on get paid
And all that glitters is gold
Only shooting stars
Somebody once asked could I spare some change for gas?
I need to get myself away from this place
I said yep what a concept
I could use a little fuel myself
And we could all use a little change
Well, the years start coming and they don\'t stop coming
Fed to the rules and I hit the ground running
Didn\'t make sense not to live for fun
Your brain gets smart but your head gets dumb
So much to do, so much to see
So what\'s wrong with taking the back streets?
You\'ll never know if you don\'t go (go!)
You\'ll never shine if you don\'t glow
Hey now, you\'re an all-star, get your game on, go play
Hey now, you\'re a rock star, get the show on, get paid
And all that glitters is gold
Only shooting stars break the mold
And all that glitters is gold
Only shooting stars break the mold
END

my $rawprog = '';

#Get script either in file or inline
if ($ARGV[0] eq '-f'){
    open(my $fh, '<', $ARGV[1]) or die "Cannot open file $ARGV[1]";
    while (my $row = <$fh>){
	chomp $row;
	$rawprog = $rawprog . $row;
    }
    close($fh);
}else{$rawprog = $ARGV[0];}




my @symbols = split //, '_-$&@!#.%?+12345z;*';
my $s = '';
my $currentprog = '';
my $lab = '';
#remove comments
$rawprog =~ s/%.*?%//gm;
$rawprog =~ s/%//g;
###
# Convert & to newlines
#$rawprog =~ s/\&/\n/g;
###

# Split "Calls" onto each line
my $prechar = ''; # the previous char
foreach my $char (split //, $rawprog) {

    if ($char eq $prechar) {$currentprog = $currentprog . $char;}
    else {$currentprog = $currentprog . "\n$char";}
    $prechar = $char;    
}

my @splitprog = split(/\n/, $currentprog);
my @archive = split(/\n/, $currentprog);

## Restart after adding label
 RESTART:
###reuse currentprog to start translation
    $currentprog = 'my $s = \'\';' . "\n";
###
my $N = 0;
my $minicall = '';

foreach my $line (@splitprog){
    #reinterpret line after mini program replacement
  REINTERPRET:
    my $firstchar = substr($line, 0, 1);
    #handle _ append to s
    if ( '_' eq $firstchar){
	$currentprog = $currentprog . '$s = $s . \'' . chr(length($line)) . "\'\;\n";
    }
    #handle - prepend to s
    elsif ( '-' eq $firstchar){
	$currentprog = $currentprog . '$s = \'' . chr(length($line)) . '\' . $s' . "\;\n";
    }
    #handle $ print s and clear if odd
    elsif ('$' eq $firstchar){
	$currentprog = $currentprog . 'print $s;' . "\n";
	if (length($line) % 2 == 1){
	    $currentprog = $currentprog . '$s = \'\';' . "\n";
	}
    }
    #handle . exit
    elsif ('.' eq $firstchar){
	$currentprog = $currentprog . 'exit;' . "\n";
    }
    #handle ; print lyrics
    elsif (';' eq $firstchar){
	$currentprog = $currentprog . 'print \'' . $allstar . "\'\; \n";
    }
    #handle @ generate label
    elsif ('@' eq $firstchar){
	$lab = 'l' . length($line);
    }
    #handle ! set label
    elsif ('!' eq $firstchar){
	my $callnum = length($line);
	#make sure we havent done this already
	if ($splitprog[$callnum] !~ /^l[1-9]+/){
	    splice @splitprog, $callnum, 0, $lab;
	    goto RESTART;
	}
    }
    #handle reinserted label 
    elsif ('l' eq $firstchar){
	$currentprog = $currentprog . $line . ":\n";
    }
    #handle # goto label
    elsif ('#' eq $firstchar){
	$currentprog = $currentprog . 'goto l' . length($line) . ";\n";
    }
    #handle ? get input and append to s
    elsif ('?' eq $firstchar){
	$currentprog = $currentprog . '$_ = <STDIN>; chomp $_; $s = $s . $_;' . "\n" ;
    }
    #handle + Append the source of (N-1) call to s. If N is 1, the entire source is stored in s.
    elsif ('+' eq $firstchar){
	my $callnum = length($line) - 1;
	#if '0' 
	if ($callnum == 0){
	    $currentprog = $currentprog . '$s = $s . \'' . $rawprog . "\';\n";
	} else {
	    $currentprog = $currentprog . '$s = $s . \'' . $archive[$callnum] . "\';\n";
	}
    }
    #handle 1 begin miniprogram (sub)
    elsif ('1' eq $firstchar){
	$currentprog = $currentprog . 'sub proc' . length($line) . " { \n";
    }
    #handle 2 end miniprogram
    elsif ('2' eq $firstchar){
	$currentprog = $currentprog . "} \n";
    }
    #handle 3 get call for miniprogram
    elsif ('3' eq $firstchar){
	$minicall = $symbols[length($line) - 1];
    }
    #handle 4 set N for previous 3 call
    elsif ('4' eq $firstchar){
	my $n = length($line);
	$line = $minicall x $n;
	goto REINTERPRET;
    }
    #handle 5 call subproc N
    elsif ('5' eq $firstchar){
	$currentprog = $currentprog . 'proc' . length($line) . ";\n" ;
    }
    #handle z sleep for N seconds
    elsif ('z' eq $firstchar){
	$currentprog = $currentprog . 'sleep ' . length($line) . ";\n";
    }
    #handle * interpret s as source
    elsif ('*' eq $firstchar){
	$currentprog = $currentprog . 'system "perl main.pl $s";' . "\n";
    }
}


#################!!!!!!!!!!!!!!!!!!!!
## Generate a random temp file
################!!!!!!!!!!!!!!!!!!
my $fh = File::Temp->new( TEMPLATE => 'tempXXXXX',
			  DIR => '.',
			  SUFFIX => '.pl');
#write program to tempfile
print $fh "$currentprog";
## run temp file
system 'perl ' . $fh->filename;
